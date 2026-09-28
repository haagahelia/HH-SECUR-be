import BaseRepository from "./BaseRepository.js";
import { AddUserRepository } from "./AddUserRepository.js";
import { AddOrganizationRepository } from "./AddOrganizationRepository.js";
import { AddHHRoleRepository } from "./AddHHRoleRepository.js";
import { AddCollaborationTypeRepository } from "./AddCollaborationTypeRepository.js";
import { AddCountryRepository } from "./AddCountryRepository.js";
import { AddConsortiumTypeRepository } from "./AddConsortiumTypeRepository.js";
import { AddOrganizationTypeRepository } from "./AddOrganizationTypeRepository.js";
import { AddDurationRepository } from "./AddDurationRepository.js";
import { AddCollaborationHistoryRepository } from "./AddCollaborationHistoryRepository.js";
import { AddEthicsAssessmentRepository } from "./AddEthicsAssessmentRepoitory.js";
import { AddLiabilityRepository } from "./addLiabilityRepository.js";


const CombinedRepository = AddLiabilityRepository(AddEthicsAssessmentRepository(AddCollaborationHistoryRepository(AddDurationRepository(AddOrganizationTypeRepository(AddConsortiumTypeRepository(AddCountryRepository(AddCollaborationTypeRepository(AddHHRoleRepository(AddOrganizationRepository(AddUserRepository(BaseRepository)))))))))));
const repository = new CombinedRepository();

//const repository = new BaseRepository();

export default repository;