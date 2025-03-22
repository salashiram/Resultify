	use Resultify;
	DROP PROCEDURE IF EXISTS spUserDetails;
	DELIMITER //
	CREATE PROCEDURE spUserDetails 
	(
		in p_user_id int
	)
		BEGIN
			SELECT
				Users.email,
				Users.is_active,
				UserRol.id AS userRol,
				UserProfiles.first_name,
				UserProfiles.last_name,
				UserProfiles.phone_number
			FROM Users
			LEFT JOIN UserRol ON Users.rol_id = UserRol.id
			LEFT JOIN UserProfiles ON UserProfiles.user_id = Users.id
			WHERE Users.id = p_user_id;
		END //
	DELIMITER ;