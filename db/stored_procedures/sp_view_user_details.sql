	use Resultify;
	drop procedure if exists spUserDetails;
	delimiter //
	create procedure spUserDetails 
	(
		in p_user_id int
	)
		begin
			select
				Users.email,
				Users.is_active,
				UserRol.id AS userRol,
				UserProfiles.first_name,
				UserProfiles.last_name,
				UserProfiles.phone_number
			from Users
			left join UserRol ON Users.rol_id = UserRol.id
			left join UserProfiles ON UserProfiles.user_id = Users.id
			where Users.id = p_user_id;
		end //
	delimiter ;
    
 
    
    