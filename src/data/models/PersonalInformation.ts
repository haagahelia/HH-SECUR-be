import { CreationOptional, InferAttributes, InferCreationAttributes, NonAttribute } from "sequelize";
import { AllowNull, Column, DataType, HasMany, Model, NotEmpty, Table, Unique, } from "sequelize-typescript";
import Report from "./Report";


@Table({
    tableName: "personal_information",
    modelName: "PersonalInformation",
})
export default class PersonalInformation extends Model<
    InferAttributes<PersonalInformation>,
    InferCreationAttributes<PersonalInformation>
> {
    @Column({
        primaryKey: true,
        type: DataType.BIGINT,
        autoIncrement: true,
    })
    declare id: CreationOptional<number>

    @AllowNull(false)
    @NotEmpty
    @Unique({ name: "personal_information_code_unique", msg: "code for personal information must be unique" })
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

    @HasMany(() => Report)
    declare reports?: NonAttribute<Report>[];
}