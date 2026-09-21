import BaseRepository from "./BaseRepository.js";
import { AddUserRepository } from "./AddUserRepository.js";
import { AddOrganizationRepository } from "./AddOrganizationRepository.js";
import { AddHHRoleRepository } from "./AddHHRoleRepository.js";
import { AddCollaborationTypeRepository } from "./AddCollaborationTypeRepository.js";

const CombinedRepository = AddCollaborationTypeRepository(AddHHRoleRepository(AddOrganizationRepository(AddUserRepository(BaseRepository))));
const repository = new CombinedRepository();

//const repository = new BaseRepository();

export default repository;