import { CreationOptional, InferAttributes, InferCreationAttributes, NonAttribute } from "sequelize";
import { AllowNull, BelongsTo, Column, DataType, ForeignKey, HasMany, Index, Model, NotEmpty, PrimaryKey, Table, Unique, } from "sequelize-typescript";
import Report from "./Report";
import CollaborationType from "./CollaborationType";


@Table({
    tableName: "report_collaboration_type",
    modelName: "ReportCollaborationType",
})

export default class ReportCollaborationType extends Model<
    InferAttributes<ReportCollaborationType>,
    InferCreationAttributes<ReportCollaborationType>
> {
    @Column({
        primaryKey: true,
        type: DataType.BIGINT,
        autoIncrement: true,
    })
    declare id: CreationOptional<number>

    @ForeignKey(() => Report)
    @AllowNull(false)
    /*
    @Index({
        name: "report_collaboration_type_unique",
        unique: true,
    })
        */
    @Column({
        type: DataType.BIGINT,
        field: "report_id",
    })
    declare reportId: number;

    @ForeignKey(() => CollaborationType)
    @AllowNull(false)
    /*
    @Index({
        name: "report_collaboration_type_unique",
        unique: true,
    })
        */
    @Column({
        type: DataType.BIGINT,
        field: "collaboration_type_id",
    })
    declare collaborationTypeId: number;

    @BelongsTo(() => Report)
    declare report?: NonAttribute<Report>;

    @BelongsTo(() => CollaborationType)
    declare collaborationType?: NonAttribute<CollaborationType>;

}