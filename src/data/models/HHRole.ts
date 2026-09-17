import { CreationOptional, InferAttributes, InferCreationAttributes } from "sequelize";
import { AllowNull, AutoIncrement, Column, CreatedAt, DataType, Model, NotEmpty, PrimaryKey, Table, Unique, UpdatedAt, IsEmail } from "sequelize-typescript";


@Table({
    tableName: "hh_role",
    modelName: "HHRole ",
})
export default class HHRole extends Model<
    InferAttributes<HHRole>,
    InferCreationAttributes<HHRole>
> {
    @Column({
        primaryKey: true,
        type: DataType.BIGINT,
        autoIncrement: true,
    })
    declare id: CreationOptional<number>

    @AllowNull(false)
    @NotEmpty
    @Unique
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

    @CreatedAt
    declare created_at: CreationOptional<Date>;

    @UpdatedAt
    declare updated_at: CreationOptional<Date>;
}