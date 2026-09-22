import { CreationOptional, InferAttributes, InferCreationAttributes } from "sequelize";
import { AllowNull, Column, DataType, Model, NotEmpty, PrimaryKey, Table, Unique, } from "sequelize-typescript";


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
    @Unique({name: "consortium_type_option_unique", msg: "Option for consortium type must be unique"})
    @Column({
        type: DataType.STRING
    })
    declare option: string;

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

}
