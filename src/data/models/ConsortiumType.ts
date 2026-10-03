import { CreationOptional, InferAttributes, InferCreationAttributes, NonAttribute } from "sequelize";
import { AllowNull, Column, DataType, HasMany, Model, NotEmpty, PrimaryKey, Table, Unique, } from "sequelize-typescript";
import Report from "./Report";


@Table({
    tableName: "consortium_type",
    modelName: "ConsortiumType",
})

export default class ConsortiumType extends Model<
    InferAttributes<ConsortiumType>,
    InferCreationAttributes<ConsortiumType>
> {
    @Column({
        primaryKey: true,
        type: DataType.BIGINT,
        autoIncrement: true,
    })
    declare id: CreationOptional<number>

    @AllowNull(false)
    @NotEmpty
    @Unique({ name: "consortium_type_code_unique", msg: "Code for consortium type must be unique" })
    @Column({
        type: DataType.STRING
    })
    declare code: string;

    @AllowNull(false)
    @NotEmpty
    @Column({
        type: DataType.STRING,
        field: "consortium_type_fi",
    })
    declare fi: string;

    @AllowNull(false)
    @NotEmpty
    @Column({
        type: DataType.STRING,
        field: "consortium_type_en",
    })
    declare en: string;

    @HasMany(() => Report)
    declare reports?: NonAttribute<Report>[];

}
