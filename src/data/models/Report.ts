import { CreationOptional, InferAttributes, InferCreationAttributes, NonAttribute } from "sequelize";
import { AllowNull, BelongsTo, BelongsToMany, Column, CreatedAt, DataType, ForeignKey, HasMany, Model, NotEmpty, Table, Unique, UpdatedAt, } from "sequelize-typescript";
import ReportSnapshot from "./ReportSnapshot";
import CollaborationHistory from "./CollaborationHistory";
import CollaborationType from "./CollaborationType";
import ReportCollaborationType from "./ReportCollaborationType";


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

    @ForeignKey(() => CollaborationHistory)
    @AllowNull(true)
    @Column({
        type: DataType.BIGINT,
        field: "collaboration_history_id",
    })
    declare collaborationHistoryId: number;

    @CreatedAt
    declare created_at: CreationOptional<Date>;

    @UpdatedAt
    declare updated_at: CreationOptional<Date>;

    @HasMany(() => ReportSnapshot)
    declare reportSnapshots?: NonAttribute<ReportSnapshot>[];

    @BelongsTo(() => CollaborationHistory)
    declare collaborationHistory?: NonAttribute<CollaborationHistory>;

    @BelongsToMany(() => CollaborationType, () => ReportCollaborationType)
    declare collaborationTypes?: NonAttribute<CollaborationType[]>;

}