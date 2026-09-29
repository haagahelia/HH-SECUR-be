import { CreationOptional, InferAttributes, InferCreationAttributes, NonAttribute } from "sequelize";
import { AllowNull, Column, DataType, HasMany, Model, NotEmpty, Table, Unique, } from "sequelize-typescript";
import Report from "./Report";


@Table({
    tableName: "contract_info",
    modelName: "ContractInfo",
})

export default class ContractInfo extends Model<
    InferAttributes<ContractInfo>,
    InferCreationAttributes<ContractInfo>
> {
    @Column({
        primaryKey: true,
        type: DataType.BIGINT,
        autoIncrement: true,
    })
    declare id: CreationOptional<number>

    @AllowNull(false)
    @NotEmpty
    @Unique({ name: "contract_info_code_unique", msg: "code for contract info must be unique" })
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

    @HasMany(() => Report)
    declare reports?: NonAttribute<Report>[];

}
