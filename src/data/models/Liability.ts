import { CreationOptional, InferAttributes, InferCreationAttributes } from "sequelize";
import { AllowNull, Column, DataType, Model, NotEmpty, PrimaryKey, Table, Unique, } from "sequelize-typescript";


@Table({
    tableName: "liability",
    modelName: "Liability",
})

export default class Liability extends Model<
    InferAttributes<Liability>,
    InferCreationAttributes<Liability>

> {
    @Column({
        primaryKey: true,
        type: DataType.BIGINT,
        autoIncrement: true,
    })
    declare id: CreationOptional<number>

    @AllowNull(false)
    @NotEmpty
    @Unique({ name: "liability_code_unique", msg: "Liability code must be unique" })
    @Column({
        type: DataType.STRING,
        field: "code",
    })
    declare code: string;

    @AllowNull(false)
    @NotEmpty
    @Column({
        type: DataType.STRING,
        field: "fi",
    })
    declare fi: string;

    @AllowNull(false)
    @NotEmpty
    @Column({
        type: DataType.STRING,
        field: "en",
    })
    declare en: string;
}