	use Resultify;

	drop view if exists vShowUsers;
	create view vShowUsers  as
			select
				Users.id,
				Users.email,
				Users.is_active,
				UserRol.id AS userRol,
                UserProfiles.student_id,
				UserProfiles.first_name,
				UserProfiles.last_name,
				UserProfiles.phone_number
			from Users
			left join UserRol ON Users.rol_id = UserRol.id
			left join UserProfiles ON UserProfiles.user_id = Users.id
            where Users.is_active = 1;
            
            
 