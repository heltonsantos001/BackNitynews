-- CreateTable
CREATE TABLE `Noticia` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `titulo` VARCHAR(191) NOT NULL,
    `descricao` VARCHAR(191) NULL,
    `url` VARCHAR(191) NOT NULL,
    `dataPublicacao` DATETIME(3) NOT NULL,
    `fonte` VARCHAR(191) NULL,
    `autor` VARCHAR(191) NULL,
    `categoria` VARCHAR(191) NULL,
    `imagem` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
