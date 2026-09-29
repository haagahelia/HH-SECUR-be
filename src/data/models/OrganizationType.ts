import { CreationOptional, InferAttributes, InferCreationAttributes } from "sequelize";
import { AllowNull, Column, DataType, Model, NotEmpty, Table, Unique, } from "sequelize-typescript";


@Table({
    tableName: "organization_type",
    modelName: "OrganizationType",
})

export default class OrganizationType extends Model<
    InferAttributes<OrganizationType>,
    InferCreationAttributes<OrganizationType>
> {
    @Column({
        primaryKey: true,
        type: DataType.BIGINT,
        autoIncrement: true,
    })
    declare id: CreationOptional<number>

    @AllowNull(false)
    @NotEmpty
    @Unique({name: "organization_type_code_unique", msg: "code for organization type must be unique"})
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