import { InferAttributes, InferCreationAttributes } from "sequelize";
import { AllowNull, Column, DataType, Model, NotEmpty, PrimaryKey, Table, } from "sequelize-typescript";


@Table({
    tableName: "organization",
    modelName: "Organization",
})
export default class Organization extends Model<
    InferAttributes<Organization>,
    InferCreationAttributes<Organization>
>{
    @Column({
            primaryKey: true,
            type: DataType.STRING,
        })
    declare id: string;

    @AllowNull(false)
    @NotEmpty
    @Column({
            type: DataType.STRING
            })
    declare name_fi: string;

    @AllowNull(false)
    @NotEmpty
    @Column({
            type: DataType.STRING
            })
    declare name_en: string;

    @AllowNull(false)
    @NotEmpty
    @Column({
            type: DataType.STRING
            })
    declare country_id: string;
}
