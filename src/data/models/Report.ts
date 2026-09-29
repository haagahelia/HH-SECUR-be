import { CreationOptional, InferAttributes, InferCreationAttributes, NonAttribute } from "sequelize";
import { AllowNull, Column, CreatedAt, DataType, HasMany, Model, NotEmpty, Table, Unique, UpdatedAt, } from "sequelize-typescript";
import ReportSnapshot from "./ReportSnapshot";


@Table({
    tableName: "report",
    modelName: "Report",
})

export default class Report extends Model<
    InferAttributes<Report>,
    InferCreationAttributes<Report>
> {
    @Column({
        primaryKey: true,
        type: DataType.BIGINT,
        autoIncrement: true,
    })
    declare id: CreationOptional<number>

    @CreatedAt
    declare created_at: CreationOptional<Date>;

    @UpdatedAt
    declare updated_at: CreationOptional<Date>;

    @HasMany(() => ReportSnapshot)
    declare reportSnapshots?: NonAttribute<ReportSnapshot>[];
    
}