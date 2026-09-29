import { CreationOptional, InferAttributes, InferCreationAttributes } from "sequelize";
import { AllowNull, Column, DataType, Model, NotEmpty, Table, Unique, } from "sequelize-typescript";


@Table({
    tableName: "collaboration_history",
    modelName: "CollaborationHistory",
})

export default class CollaborationHistory extends Model<
    InferAttributes<CollaborationHistory>,
    InferCreationAttributes<CollaborationHistory>
> {
    @Column({
        primaryKey: true,
        type: DataType.BIGINT,
        autoIncrement: true,
    })
    declare id: CreationOptional<number>

    @AllowNull(false)
    @NotEmpty
    @Unique({name: "collaboration_history_code_unique", msg: "code for collaboration history must be unique"})
    @Column({
        type: DataType.STRING
    })
    declare code: string;

    @AllowNull(false)
    @NotEmpty
    @Column({
        type: DataType.STRING,
        field: "name_fi",
        })
    declare fi: string;

    @AllowNull(false)
    @NotEmpty
    @Column({
        type: DataType.STRING,
        field: "name_en",
        })
    declare en: string;

    }
