import { CreationOptional, InferAttributes, InferCreationAttributes } from "sequelize";
import { AllowNull, Column, DataType, Model, NotEmpty, Table, Unique, } from "sequelize-typescript";


@Table({
    tableName:"ethics_assessment",
    modelName:"EthicsAssessment",
})

export default class EthicsAssessment extends Model<
    InferAttributes<EthicsAssessment>,
    InferCreationAttributes<EthicsAssessment>
> {
    @Column({
        primaryKey: true,
        type: DataType.BIGINT,
        autoIncrement: true,
    })
    declare id: CreationOptional<number>

    @AllowNull(false)
    @NotEmpty
    @Unique({name: "ethics_assessment_code_unique", msg: "code for ethics assessment must be unique"})
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