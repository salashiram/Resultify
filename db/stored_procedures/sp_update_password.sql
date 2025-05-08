	use Resultify;
	DROP PROCEDURE IF EXISTS spUpdatePassword;
	DELIMITER //

	CREATE PROCEDURE spUpdatePassword 
	(
		IN p_user_id INT,
        IN p_new_password_hash varchar(255)
	)
	BEGIN
			UPDATE Users 
			SET password_hash = p_new_password_hash 
			WHERE id = p_user_id;
	END //

	DELIMITER ;
    
    
  

    
    
    
    
 
    
    