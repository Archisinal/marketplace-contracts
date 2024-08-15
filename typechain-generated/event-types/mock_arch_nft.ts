import type {ReturnNumber} from "@archisinal/typechain-types";
import type * as ReturnTypes from '../types-returns/mock_arch_nft';

export interface Transfer {
	from: ReturnTypes.AccountId | null;
	to: ReturnTypes.AccountId | null;
	id: number;
}

export interface Approval {
	from: ReturnTypes.AccountId;
	to: ReturnTypes.AccountId;
	id: number;
}

export interface ApprovalForAll {
	owner: ReturnTypes.AccountId;
	operator: ReturnTypes.AccountId;
	approved: boolean;
}

