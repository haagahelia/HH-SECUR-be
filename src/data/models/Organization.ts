import { CreationOptional, InferAttributes, InferCreationAttributes } from "sequelize";
import { AllowNull, Column, DataType, Model, NotEmpty, PrimaryKey, Table, Unique, } from "sequelize-typescript";


@Table({
    tableName: "organization",
    modelName: "Organization",
})
export default class Organization extends Model<
    InferAttributes<Organization>,
    InferCreationAttributes<Organization>
> {
    @Column({
        primaryKey: true,
        type: DataType.BIGINT,
        autoIncrement: true,
    })
    declare id: CreationOptional<number>

    @AllowNull(false)
    @NotEmpty
    @Unique({ name: "organization_code_unique", msg: "Organization code must be unique" })
    @Column({
        type: DataType.STRING,
        field: "code",
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

    @AllowNull(false)
    @NotEmpty
    @Column({
        type: DataType.STRING
    })
    declare country_code: string;
}
