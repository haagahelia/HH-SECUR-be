import { CreationOptional, InferAttributes, InferCreationAttributes } from "sequelize";
import { AutoIncrement, Column, CreatedAt, DataType, Model, PrimaryKey, Table, Unique, UpdatedAt } from "sequelize-typescript";


@Table({
    tableName: "user",
    modelName: "User",
})
export default class User extends Model<
    InferAttributes<User>,
    InferCreationAttributes<User>
> {
    @Column({
        primaryKey: true,
        type: DataType.BIGINT,
        autoIncrement: true,
    })
    declare id: CreationOptional<number>

    @Column({
        type: DataType.STRING
    })
    declare username: string;

    @Unique
    @Column({
        type: DataType.STRING
    })
    declare email: string;

    @Column({
        type: DataType.STRING
    })
    declare password_hash: string;

    @CreatedAt
    declare created_at: CreationOptional<Date>;

    @UpdatedAt
    declare updated_at: CreationOptional<Date>;
}