import { CreationOptional, InferAttributes, InferCreationAttributes } from "sequelize";
import { AllowNull, Column, DataType, Model, NotEmpty, PrimaryKey, Table, Unique, } from "sequelize-typescript";


@Table({
    tableName: "collaboration_type",
    modelName: "CollaborationType",
})

export default class CollaborationType extends Model<
    InferAttributes<CollaborationType>,
    InferCreationAttributes<CollaborationType>
> {
    @Column({
        primaryKey: true,
        type: DataType.BIGINT,
        autoIncrement: true,
    })
    declare id: CreationOptional<number>

    @AllowNull(false)
    @NotEmpty
    @Unique({name: "collaboration_type_option_unique", msg: "Option for collaboration type must be unique"})
    @Column({
        type: DataType.STRING
    })
    declare code: string;

    @AllowNull(false)
    @NotEmpty
    @Column({
        type: DataType.STRING,
        field: "collaboration_type_fi",
    })
    declare fi: string;

    @AllowNull(false)
    @NotEmpty
    @Column({
        type: DataType.STRING,
        field: "collaboration_type_en",
    })
    declare en: string;

}
