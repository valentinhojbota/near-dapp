#![deny(warnings)]
use hex;
use near_sdk::{
    borsh::{self, BorshDeserialize, BorshSerialize},
    collections::{LookupMap, UnorderedMap},

    env,

    json_types::{U128},
    near_bindgen,
    // type definitions
    AccountId,
    Balance,
    PublicKey,
};
use serde::Serialize;

// Importing NEAR Rust SDK Standard
use near_contract_standards::non_fungible_token::Token;

#[global_allocator]
static ALLOC: near_sdk::wee_alloc::WeeAlloc = near_sdk::wee_alloc::WeeAlloc::INIT;

// Minting fee and gas limit
const MINT_FEE: u128 = 1_000_000_000_000_000_000_000;

pub type TokenId = u64;
pub struct Core {
    pub tokens: LookupMap<TokenId, Token>,
}

#[derive(Debug, Serialize, BorshDeserialize, BorshSerialize)]
pub struct TokenData {
    pub owner_id: AccountId,
    pub metadata: String,
    pub price: U128,
}

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct NonFungibleTokenBasic {
    pub pubkey_minted: UnorderedMap<PublicKey, u8>,
    pub token_to_data: UnorderedMap<TokenId, TokenData>,
    pub account_to_proceeds: UnorderedMap<AccountId, Balance>,
    pub owner_id: AccountId,
    pub token_id: TokenId,
}

impl Default for NonFungibleTokenBasic {
    fn default() -> Self {
        panic!("NFT should be initialized before usage")
    }
}

#[near_bindgen]
impl NonFungibleTokenBasic {
    #[init]
    pub fn new(owner_id: AccountId) -> Self {
        assert!(
            env::is_valid_account_id(owner_id.as_bytes()),
            "Owner's account ID is invalid."
        );
        assert!(!env::state_exists(), "Already initialized");
        Self {
            pubkey_minted: UnorderedMap::new(b"pubkey_minted".to_vec()),
            token_to_data: UnorderedMap::new(b"token_to_account".to_vec()),
            account_to_proceeds: UnorderedMap::new(b"account_to_proceeds".to_vec()),
            owner_id,
            token_id: 0,
        }
    }

    #[payable]
    pub fn mint_token(&mut self, owner_id: AccountId, metadata: String) -> TokenId {
        let deposit = env::attached_deposit();
        assert!(deposit == MINT_FEE, "{} {}", deposit, MINT_FEE);
        let token_id_num: u64 = self.token_id;
        let token_id_num_addition: u64 = &token_id_num + 1;
        self.token_id = token_id_num_addition;
        let token_data = TokenData {
            owner_id,
            metadata,
            price: U128(0),
        };
        self.token_to_data.insert(&self.token_id, &token_data);
        self.token_id.clone()
    }

    pub fn nft_transfer(
        &mut self,
        receiver_id: AccountId,
        token_id: TokenId,
    ) {
        let mut token_data = self.get_token_data(token_id.clone());
        self.only_owner(token_data.owner_id.clone());
        token_data.owner_id = receiver_id;
        self.token_to_data.insert(&token_id, &token_data);
    }

    /// Utils
    fn only_owner(&mut self, account_id: AccountId) {
        let signer = env::signer_account_id();
        if signer != account_id {
            let implicit_account_id: AccountId = hex::encode(&env::signer_account_pk()[1..]);
            if implicit_account_id != account_id {
                env::panic(b"Attempt to call transfer on tokens belonging to another account.")
            }
        }
    }

    /// View Methods
    pub fn get_token_data(&self, token_id: TokenId) -> TokenData {
        match self.token_to_data.get(&token_id) {
            Some(token_data) => token_data,
            None => env::panic(b"No token exists"),
        }
    }

    pub fn get_num_tokens(&self) -> TokenId {
        self.token_id.clone()
    }
}


#[cfg(test)]
mod tests {
    use super::*;
    use near_sdk::MockedBlockchain;
    use near_sdk::{testing_env, VMContext};

    fn alice() -> AccountId {
        "alice.testnet".to_string()
    }
    fn bob() -> AccountId {
        "bob.testnet".to_string()
    }
    fn carol() -> AccountId {
        "carol.testnet".to_string()
    }
    fn metadata() -> String {
        "blah".to_string()
    }

    // part of writing unit tests is setting up a mock context
    // this is a useful list to peek at when wondering what's available in env::*
    fn get_context(predecessor_account_id: String, storage_usage: u64) -> VMContext {
        VMContext {
            current_account_id: alice(),
            signer_account_id: bob(),
            signer_account_pk: vec![0, 1, 2],
            predecessor_account_id,
            input: vec![],
            block_index: 0,
            block_timestamp: 0,
            account_balance: 0,
            account_locked_balance: 0,
            storage_usage,
            attached_deposit: 0,
            prepaid_gas: 10u64.pow(18),
            random_seed: vec![0, 1, 2],
            is_view: false,
            output_data_receivers: vec![],
            epoch_height: 19,
        }
    }

    #[test]
    fn mint_token_get_token_owner() {
        let mut context = get_context(bob(), 0);
        context.attached_deposit = MINT_FEE.into();
        testing_env!(context);

        let mut contract = NonFungibleTokenBasic::new(bob());
        let token_id = contract.mint_token(carol(), metadata());
        let token_data = contract.get_token_data(token_id.clone());
        assert_eq!(carol(), token_data.owner_id, "Unexpected token owner.");
    }

    #[test]
    fn transfer_with_your_own_token() {
        // Owner account: bob.testnet
        // New owner account: alice.testnet

        let mut context = get_context(bob(), 0);
        context.attached_deposit = MINT_FEE.into();
        testing_env!(context);

        let mut contract = NonFungibleTokenBasic::new(bob());
        let token_id = contract.mint_token(bob(), metadata());
        contract.nft_transfer(alice(), token_id.clone());

        let token_data = contract.get_token_data(token_id.clone());
        assert_eq!(alice(), token_data.owner_id, "Unexpected token owner.");
    }
}