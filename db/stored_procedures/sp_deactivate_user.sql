	use Resultify;
	DROP PROCEDURE IF EXISTS spDeactivateUser;
	DELIMITER //

	CREATE PROCEDURE spDeactivateUser 
	(
		IN p_param INT,
		IN p_user_id INT
	)
	BEGIN
		IF p_param = 1 THEN
			UPDATE Users 
			SET is_active = 1 
			WHERE id = p_user_id;
		ELSEIF p_param = 2 THEN
			UPDATE Users 
			SET is_active = 0 
			WHERE id = p_user_id;
		END IF;
	END //

	DELIMITER ;

    
    
    
    
 
    
    