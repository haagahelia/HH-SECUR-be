import BaseRepository from "./BaseRepository.js";
import { AddUserRepository } from "./AddUserRepository.js";

const CombinedRepository = AddUserRepository(BaseRepository);
const repository = new CombinedRepository();

//const repository = new BaseRepository();

export default repository;