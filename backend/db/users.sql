CREATE TABLE `users` (
	`id` INT(11) NOT NULL AUTO_INCREMENT COMMENT 'Primare key',
	`name` VARCHAR(50) NOT NULL COMMENT 'Column containing the users name' COLLATE 'utf8mb4_general_ci',
	`email` VARCHAR(50) NOT NULL COMMENT 'Column containing the users email' COLLATE 'utf8mb4_general_ci',
	`situation` VARCHAR(50) NOT NULL COMMENT 'Column containing the users status' COLLATE 'utf8mb4_general_ci',
	`date_admission` DATETIME NOT NULL DEFAULT current_timestamp() COMMENT 'User admission date',
	`date_created` DATETIME NOT NULL DEFAULT current_timestamp() COMMENT 'Date the user was created in the system or data was entered into the database.',
	`date_updated` DATETIME NULL DEFAULT NULL COMMENT 'Date on which user data was changed in the system.',
	PRIMARY KEY (`id`) USING BTREE
)
COLLATE='utf8mb4_general_ci'
ENGINE=InnoDB
;
