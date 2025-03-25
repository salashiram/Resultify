	use Resultify;
	drop procedure if exists spSearchUser;
	delimiter //
	create procedure spSearchUser 
	(
		in p_user_id int,
        in p_email varchar(100),
        in p_student_id int,
        in p_phone_number varchar(100)
	)
		begin
			select
				Users.id,
				Users.email,
				Users.is_active,
				UserRol.name as userRol,
                UserProfiles.student_id,
				UserProfiles.first_name,
				UserProfiles.last_name,
				UserProfiles.phone_number
			from Users
			left join UserRol on Users.rol_id = UserRol.id
			left join UserProfiles on UserProfiles.user_id = Users.id
			where 
				(p_user_id is null or Users.id = p_user_id)
				and (p_email is null or Users.email like concat('%', p_email, '%'))
                and (p_student_id is null or UserProfiles.student_id like concat('%', p_student_id, '%'))
                and (p_phone_number is null or UserProfiles.phone_number like concat('%', p_phone_number, '%'));
		end //
	delimiter ;
    
    
    
 
    
    