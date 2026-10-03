import { CreationOptional, InferAttributes, InferCreationAttributes } from "sequelize";
import { AllowNull, Column, DataType, Model, NotEmpty, PrimaryKey, Table, Unique } from "sequelize-typescript";


@Table({
    tableName: "funding",
    modelName: "Funding",
})
export default class Funding extends Model<
    InferAttributes<Funding>,
    InferCreationAttributes<Funding>> {

    @PrimaryKey
    @Column({
        primaryKey: true,
        type: DataType.BIGINT,
        autoIncrement: true,
    })
    declare id: CreationOptional<number>

    @AllowNull(false)
    @NotEmpty
    @Unique({name: "funding_code_unique", msg: "code for funding must be unique"})
    @Column({
        type: DataType.STRING
    })
    declare code: string;

    @AllowNull(false)
    @NotEmpty
    @Unique({name: "funding_name_fi_unique", msg: "name for funding must be unique"})
    @Column({
        type: DataType.STRING,
        field: "name_fi"
    })
    declare fi: string;

    @AllowNull(false)
    @NotEmpty
    @Unique({name: "funding_name_en_unique", msg: "name for funding must be unique"})
    @Column({
        type: DataType.STRING,
        field: "name_en"
    })
    declare en: string;
    }

