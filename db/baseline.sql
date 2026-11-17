CREATE TABLE `collaboration_history` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `code` varchar(255) NOT NULL,
  `name_fi` varchar(255) NOT NULL,
  `name_en` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `collaboration_history_code_unique` (`code`)
) ENGINE=InnoDB;

CREATE TABLE `collaboration_type` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `code` varchar(255) NOT NULL,
  `name_fi` varchar(255) NOT NULL,
  `name_en` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `collaboration_type_option_unique` (`code`)
) ENGINE=InnoDB;

CREATE TABLE `consortium` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `consortium_type_id` bigint(20) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `consortium_type_id` (`consortium_type_id`),
  FOREIGN KEY (`consortium_type_id`) REFERENCES `consortium_type` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE `consortium_organization` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `consortium_id` bigint(20) NOT NULL,
  `organization_id` bigint(20) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `consortium_organization_organizationId_consortiumId_unique` (`consortium_id`,`organization_id`),
  KEY `organization_id` (`organization_id`),
  FOREIGN KEY (`consortium_id`) REFERENCES `consortium` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`organization_id`) REFERENCES `organization` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE `consortium_type` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `code` varchar(255) NOT NULL,
  `name_fi` varchar(255) NOT NULL,
  `name_en` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `consortium_type_code_unique` (`code`)
) ENGINE=InnoDB;

CREATE TABLE `contract_info` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `code` varchar(255) NOT NULL,
  `name_fi` varchar(255) NOT NULL,
  `name_en` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `contract_info_code_unique` (`code`)
) ENGINE=InnoDB;

CREATE TABLE `country` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `code` varchar(255) NOT NULL,
  `name_fi` varchar(255) NOT NULL,
  `name_en` varchar(255) NOT NULL,
  `data_year` int(11) NOT NULL,
  `corruption` decimal(5,2) NOT NULL,
  `security` int(11) NOT NULL,
  `political_stability` decimal(4,2) NOT NULL,
  `academic_freedom` decimal(4,3) NOT NULL,
  `development` int(11) NOT NULL,
  `gdpr` int(11) NOT NULL,
  `sanctions` int(11) NOT NULL,
  `rule_of_law` decimal(9,8) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `country_code_unique` (`code`),
  UNIQUE KEY `country_name_fi_unique` (`name_fi`),
  UNIQUE KEY `country_name_en_unique` (`name_en`)
) ENGINE=InnoDB;

CREATE TABLE `dual_use` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `code` varchar(255) NOT NULL,
  `name_fi` varchar(255) NOT NULL,
  `name_en` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `dual_use_unique` (`code`)
) ENGINE=InnoDB;

CREATE TABLE `duration` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `code` varchar(255) NOT NULL,
  `name_fi` varchar(255) NOT NULL,
  `name_en` varchar(255) NOT NULL,
  `lowerlimit` bigint(20) DEFAULT NULL,
  `upperlimit` bigint(20) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `duration_code_unique` (`code`)
) ENGINE=InnoDB;

CREATE TABLE `ethics_assessment` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `code` varchar(255) NOT NULL,
  `name_fi` varchar(255) NOT NULL,
  `name_en` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ethics_assessment_code_unique` (`code`)
) ENGINE=InnoDB;

CREATE TABLE `funding` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `funding_option_id` bigint(20) NOT NULL,
  `funding_source_id` bigint(20) DEFAULT NULL,
  `funding_history_id` bigint(20) DEFAULT NULL,
  `funding_exchange_id` bigint(20) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `funding_option_id` (`funding_option_id`),
  KEY `funding_source_id` (`funding_source_id`),
  KEY `funding_history_id` (`funding_history_id`),
  KEY `funding_exchange_id` (`funding_exchange_id`),
  FOREIGN KEY (`funding_option_id`) REFERENCES `funding_option` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  FOREIGN KEY (`funding_source_id`) REFERENCES `funding_source` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (`funding_history_id`) REFERENCES `funding_history` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (`funding_exchange_id`) REFERENCES `funding_exchange` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE `funding_exchange` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `code` varchar(255) NOT NULL,
  `name_fi` varchar(255) NOT NULL,
  `name_en` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `funding_code_unique` (`code`),
  UNIQUE KEY `funding_name_fi_unique` (`name_fi`),
  UNIQUE KEY `funding_name_en_unique` (`name_en`)
) ENGINE=InnoDB;

CREATE TABLE `funding_history` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `code` varchar(255) NOT NULL,
  `name_fi` varchar(255) NOT NULL,
  `name_en` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `funding_code_unique` (`code`),
  UNIQUE KEY `funding_name_fi_unique` (`name_fi`),
  UNIQUE KEY `funding_name_en_unique` (`name_en`)
) ENGINE=InnoDB;

CREATE TABLE `funding_option` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `code` varchar(255) NOT NULL,
  `name_fi` varchar(255) NOT NULL,
  `name_en` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `funding_code_unique` (`code`),
  UNIQUE KEY `funding_name_fi_unique` (`name_fi`),
  UNIQUE KEY `funding_name_en_unique` (`name_en`)
) ENGINE=InnoDB;

CREATE TABLE `funding_source` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `code` varchar(255) NOT NULL,
  `name_fi` varchar(255) NOT NULL,
  `name_en` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `funding_source_code_unique` (`code`),
  UNIQUE KEY `funding_source_name_fi_unique` (`name_fi`),
  UNIQUE KEY `funding_source_name_en_unique` (`name_en`)
) ENGINE=InnoDB;

CREATE TABLE `hh_role` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `code` varchar(255) NOT NULL,
  `name_fi` varchar(255) NOT NULL,
  `name_en` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `hhrole_code_unique` (`code`)
) ENGINE=InnoDB;

CREATE TABLE `liability` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `code` varchar(255) NOT NULL,
  `name_fi` varchar(255) NOT NULL,
  `name_en` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `liability_code_unique` (`code`)
) ENGINE=InnoDB;

CREATE TABLE `organization` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `country_id` bigint(20) DEFAULT NULL,
  `code` varchar(255) DEFAULT NULL,
  `name_fi` varchar(255) NOT NULL,
  `name_en` varchar(255) NOT NULL,
  `country_code` varchar(255) NOT NULL,
  `added_manually` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `organization_name_fi_country_code_unique` (`name_fi`,`country_code`),
  UNIQUE KEY `organization_name_en_country_code_unique` (`name_en`,`country_code`),
  UNIQUE KEY `organization_code_unique` (`code`),
  KEY `country_id` (`country_id`),
  FOREIGN KEY (`country_id`) REFERENCES `country` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE `organization_type` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `code` varchar(255) NOT NULL,
  `name_fi` varchar(255) NOT NULL,
  `name_en` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `organization_type_code_unique` (`code`)
) ENGINE=InnoDB;

CREATE TABLE `personal_information` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `code` varchar(255) NOT NULL,
  `name_fi` varchar(255) NOT NULL,
  `name_en` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_information_code_unique` (`code`)
) ENGINE=InnoDB;

CREATE TABLE `report` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `collaboration_history_id` bigint(20) DEFAULT NULL,
  `consortium_id` bigint(20) DEFAULT NULL,
  `contract_info_id` bigint(20) DEFAULT NULL,
  `country_id` bigint(20) DEFAULT NULL,
  `dual_use_id` bigint(20) DEFAULT NULL,
  `duration_id` bigint(20) DEFAULT NULL,
  `ethics_assessment_id` bigint(20) DEFAULT NULL,
  `hhrole_id` bigint(20) DEFAULT NULL,
  `liability_id` bigint(20) DEFAULT NULL,
  `funding_id` bigint(20) DEFAULT NULL,
  `organization_type_id` bigint(20) DEFAULT NULL,
  `personal_information_id` bigint(20) DEFAULT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `report_name_unique` (`name`),
  KEY `collaboration_history_id` (`collaboration_history_id`),
  KEY `consortium_id` (`consortium_id`),
  KEY `contract_info_id` (`contract_info_id`),
  KEY `country_id` (`country_id`),
  KEY `dual_use_id` (`dual_use_id`),
  KEY `duration_id` (`duration_id`),
  KEY `ethics_assessment_id` (`ethics_assessment_id`),
  KEY `hhrole_id` (`hhrole_id`),
  KEY `liability_id` (`liability_id`),
  KEY `funding_id` (`funding_id`),
  KEY `organization_type_id` (`organization_type_id`),
  KEY `personal_information_id` (`personal_information_id`),
  KEY `user_id` (`user_id`),
  FOREIGN KEY (`collaboration_history_id`) REFERENCES `collaboration_history` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (`funding_id`) REFERENCES `funding` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (`organization_type_id`) REFERENCES `organization_type` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (`personal_information_id`) REFERENCES `personal_information` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (`consortium_id`) REFERENCES `consortium` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (`contract_info_id`) REFERENCES `contract_info` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (`country_id`) REFERENCES `country` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (`dual_use_id`) REFERENCES `dual_use` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (`duration_id`) REFERENCES `duration` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (`ethics_assessment_id`) REFERENCES `ethics_assessment` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (`hhrole_id`) REFERENCES `hh_role` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (`liability_id`) REFERENCES `liability` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE `report_collaboration_type` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `report_id` bigint(20) NOT NULL,
  `collaboration_type_id` bigint(20) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `report_collaboration_type_reportId_collaborationTypeId_unique` (`report_id`,`collaboration_type_id`),
  KEY `collaboration_type_id` (`collaboration_type_id`),
  FOREIGN KEY (`report_id`) REFERENCES `report` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`collaboration_type_id`) REFERENCES `collaboration_type` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE `report_snapshot` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `report_id` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `owner_username` varchar(255) NOT NULL,
  `creator_username` varchar(255) NOT NULL,
  `organization_name` varchar(255) NOT NULL,
  `additional_information` varchar(255) NOT NULL,
  `organization_other` varchar(255) NOT NULL,
  `collaboration_other` varchar(255) NOT NULL,
  `collaboration` int(11) NOT NULL,
  `country_overall` int(11) NOT NULL,
  `country_corruption` int(11) NOT NULL,
  `country_security` int(11) NOT NULL,
  `country_academic_freedom` int(11) NOT NULL,
  `country_political_stability` int(11) NOT NULL,
  `country_development` int(11) NOT NULL,
  `country_gdpr` int(11) NOT NULL,
  `country_sanctions` int(11) NOT NULL,
  `country_rule_of_law` int(11) NOT NULL,
  `organization` int(11) NOT NULL,
  `financial_overall` int(11) NOT NULL,
  `financial_exchange` int(11) NOT NULL,
  `financial_scope` int(11) NOT NULL,
  `dual_use` int(11) NOT NULL,
  `ethics` int(11) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `report_id` (`report_id`),
  FOREIGN KEY (`report_id`) REFERENCES `report` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE `user` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_username_unique` (`username`),
  UNIQUE KEY `user_email_unique` (`email`)
) ENGINE=InnoDB;
