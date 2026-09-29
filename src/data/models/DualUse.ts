import { CreationOptional, InferAttributes, InferCreationAttributes } from "sequelize";
import { AllowNull, Column, DataType, Model, NotEmpty, Table, Unique, } from "sequelize-typescript";


@Table({
    tableName: "dual_use",
    modelName: "DualUse",
})
export default class DualUse extends Model<
    InferAttributes<DualUse>,
    InferCreationAttributes<DualUse>
> {
    @Column({
        primaryKey: true,
        type: DataType.BIGINT,
        autoIncrement: true,
    })
    declare id: CreationOptional<number>

    @AllowNull(false)
    @NotEmpty
    @Unique({name: "dual_use_unique", msg: "code for dual use must be unique"})
    @Column({
        type: DataType.STRING
    })
    declare code: string;

    @AllowNull(false)
    @NotEmpty
    @Column({
        type: DataType.STRING,
        field: "name_fi"
    })
    declare fi: string;

    @AllowNull(false)
    @NotEmpty
    @Column({
        type: DataType.STRING,
        field: "name_en"
    })
    declare en: string;
}