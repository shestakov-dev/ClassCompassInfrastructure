import { Namespace, Context } from "@ory/keto-namespace-types";

class Identity implements Namespace {}

class Platform implements Namespace {
	related: {
		// Users with platform-wide admin access
		admins: Identity[];
	};

	permits = {
		manage: (ctx: Context): boolean => this.related.admins.includes(ctx.subject),
	};
}

class School implements Namespace {
	related: {
		// Users with read-only access
		members: Identity[];
		// Users with manage access
		admins: Identity[];

		parentPlatform: Platform[];
	};

	permits = {
		// Manage allows create, update and delete on school resources (but not the school itself)
		// Managing the school is something only platform admins can do
		manage: (ctx: Context): boolean =>
			this.related.parentPlatform.traverse(platform =>
				platform.permits.manage(ctx)
			) || this.related.admins.includes(ctx.subject),

		// Admins can also read
		view: (ctx: Context): boolean =>
			this.related.parentPlatform.traverse(platform =>
				platform.permits.manage(ctx)
			) ||
			this.related.admins.includes(ctx.subject) ||
			this.related.members.includes(ctx.subject),
	};
}

// --- Level 1 Resources (Direct children of School) ---

class Building implements Namespace {
	related: {
		parentSchool: School[];
	};

	permits = {
		manage: (ctx: Context): boolean =>
			this.related.parentSchool.traverse(school => school.permits.manage(ctx)),
		view: (ctx: Context): boolean =>
			this.related.parentSchool.traverse(school => school.permits.view(ctx)),
	};
}

class Subject implements Namespace {
	related: {
		parentSchool: School[];
	};

	permits = {
		manage: (ctx: Context): boolean =>
			this.related.parentSchool.traverse(school => school.permits.manage(ctx)),
		view: (ctx: Context): boolean =>
			this.related.parentSchool.traverse(school => school.permits.view(ctx)),
	};
}

class User implements Namespace {
	related: {
		parentSchool: School[];
	};

	permits = {
		manage: (ctx: Context): boolean =>
			this.related.parentSchool.traverse(school => school.permits.manage(ctx)),
		view: (ctx: Context): boolean =>
			this.related.parentSchool.traverse(school => school.permits.view(ctx)),
	};
}

class Class implements Namespace {
	related: {
		parentSchool: School[];
	};

	permits = {
		manage: (ctx: Context): boolean =>
			this.related.parentSchool.traverse(school => school.permits.manage(ctx)),
		view: (ctx: Context): boolean =>
			this.related.parentSchool.traverse(school => school.permits.view(ctx)),
	};
}

// --- Level 2 Resources (Grandchildren of School) ---

class Teacher implements Namespace {
	related: {
		parentUser: User[];
	};

	permits = {
		manage: (ctx: Context): boolean =>
			this.related.parentUser.traverse(user => user.permits.manage(ctx)),
		view: (ctx: Context): boolean =>
			this.related.parentUser.traverse(user => user.permits.view(ctx)),
	};
}

class Student implements Namespace {
	related: {
		parentUser: User[];
	};

	permits = {
		manage: (ctx: Context): boolean =>
			this.related.parentUser.traverse(user => user.permits.manage(ctx)),
		view: (ctx: Context): boolean =>
			this.related.parentUser.traverse(user => user.permits.view(ctx)),
	};
}

class Floor implements Namespace {
	related: {
		parentBuilding: Building[];
	};

	permits = {
		manage: (ctx: Context): boolean =>
			this.related.parentBuilding.traverse(building =>
				building.permits.manage(ctx)
			),
		view: (ctx: Context): boolean =>
			this.related.parentBuilding.traverse(building => building.permits.view(ctx)),
	};
}

class DailySchedule implements Namespace {
	related: {
		parentClass: Class[];
	};

	permits = {
		manage: (ctx: Context): boolean =>
			this.related.parentClass.traverse(_class => _class.permits.manage(ctx)),
		view: (ctx: Context): boolean =>
			this.related.parentClass.traverse(_class => _class.permits.view(ctx)),
	};
}

// --- Level 3 Resources (Great-grandchildren) ---

class Room implements Namespace {
	related: {
		parentFloor: Floor[];
	};

	permits = {
		manage: (ctx: Context): boolean =>
			this.related.parentFloor.traverse(floor => floor.permits.manage(ctx)),
		view: (ctx: Context): boolean =>
			this.related.parentFloor.traverse(floor => floor.permits.view(ctx)),
	};
}

class Lesson implements Namespace {
	related: {
		// We could also inherit permissions via another path, e.g. Subject,
		// but for simplicity, we use DailySchedule here
		parentDailySchedule: DailySchedule[];
	};

	permits = {
		manage: (ctx: Context): boolean =>
			this.related.parentDailySchedule.traverse(dailySchedule =>
				dailySchedule.permits.manage(ctx)
			),
		view: (ctx: Context): boolean =>
			this.related.parentDailySchedule.traverse(dailySchedule =>
				dailySchedule.permits.view(ctx)
			),
	};
}
