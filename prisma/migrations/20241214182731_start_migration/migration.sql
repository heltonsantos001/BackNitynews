-- CreateTable
CREATE TABLE `Newsletter` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT false,
    `newsletterAssinada` BOOLEAN NOT NULL DEFAULT false,
    `emailConfirmado` BOOLEAN NOT NULL DEFAULT false,
    `preferencias` VARCHAR(191) NULL,
    `dataUltimaEnvio` DATETIME(3) NULL,
    `horarioDeRegistro` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
