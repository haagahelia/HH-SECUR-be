import { CreationOptional, InferAttributes, InferCreationAttributes } from "sequelize";
import { AllowNull, Column, DataType, Model, NotEmpty, PrimaryKey, Table, Unique, } from "sequelize-typescript";


@Table({
    tableName: "country",
    modelName: "Country",
})

export default class Country extends Model<
    InferAttributes<Country>,
    InferCreationAttributes<Country>
> {
    @Column({
        primaryKey: true,
        type: DataType.BIGINT,
        autoIncrement: true,
    })
    declare id: CreationOptional<number>

    @AllowNull(false)
    @NotEmpty
    @Unique({ name: "country_code_unique", msg: "Country code must be unique" })
    @Column({
        type: DataType.STRING,
        field: "code",
    })
    declare code: string;

    @AllowNull(false)
    @NotEmpty
    @Unique({ name: "country_name_fi_unique", msg: "Country name in Finnish must be unique" })
    @Column({
        type: DataType.STRING,
        field: "name_fi",
    })
    declare fi: string;

    @AllowNull(false)
    @NotEmpty
    @Unique({ name: "country_name_en_unique", msg: "Country name in English must be unique" })
    @Column({
        type: DataType.STRING,
        field: "name_en",
    })
    declare en: string;

    @AllowNull(false)
    @NotEmpty
    @Column({
        type: DataType.INTEGER,
        field: "Data Year",
    })
    declare dataYear: number;

    @AllowNull(false)
    @NotEmpty
    @Column({
        type: DataType.DECIMAL(5, 2),
        field: "corruption",
    })
    declare corruption: number;

    @AllowNull(false)
    @NotEmpty
    @Column({
        type: DataType.INTEGER,
        field: "security",
    })
    declare security: number;

    @AllowNull(false)
    @NotEmpty
    @Column({
        type: DataType.DECIMAL(4, 2),
        field: "political_stability",
    })
    declare politicalStability: number;

    @AllowNull(false)
    @NotEmpty
    @Column({
        type: DataType.DECIMAL(4, 3),
        field: "academic_freedom",
    })
    declare academicFreedom: number;

    @AllowNull(false)
    @NotEmpty
    @Column({
        type: DataType.INTEGER,
        field: "development",
    })
    declare development: number;

    @AllowNull(false)
    @NotEmpty
    @Column({
        type: DataType.INTEGER,
        field: "gdpr",
    })
    declare gdpr: number;

    @AllowNull(false)
    @NotEmpty
    @Column({
        type: DataType.INTEGER,
        field: "sanctions",
    })
    declare sanctions: number;

    @AllowNull(false)
    @NotEmpty
    @Column({
        type: DataType.DECIMAL(9, 8),
        field: "rule_of_law",
    })
    declare ruleOfLaw: number;
}
