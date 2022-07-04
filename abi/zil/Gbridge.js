module.exports = {
    "fields": [
      { "vname": "owner", "type": "ByStr20", "depth": 0 },
      { "vname": "node_manager", "type": "ByStr20", "depth": 0 },
      { "vname": "nonce", "type": "Uint256", "depth": 0 },
      {
        "vname": "tx_claimed",
        "type": "Map (Uint256) (ByStr20)",
        "depth": 1
      },
      {
        "vname": "chains",
        "type": "Map (String) (Map (ByStr20) (Bool))",
        "depth": 2
      },
      {
        "vname": "token_type",
        "type":
          "Map (ByStr20) (CONTRACT_ADDRESS.TokenType)",
        "depth": 1
      },
      { "vname": "grph_fee", "type": "Uint128", "depth": 0 },
      { "vname": "fee_p", "type": "Uint128", "depth": 0 },
      {
        "vname": "total_fees",
        "type": "Map (ByStr20) (Uint128)",
        "depth": 1
      },
      { "vname": "paused", "type": "Bool", "depth": 0 }
    ],
    "transitions": [
      {
        "vname": "Transfer",
        "params": [
          { "vname": "chainId", "type": "String" },
          { "vname": "to", "type": "ByStr20" },
          { "vname": "token", "type": "ByStr20" },
          { "vname": "amount", "type": "Uint256" }
        ]
      },
      {
        "vname": "Claim",
        "params": [
          { "vname": "chainId", "type": "String" },
          { "vname": "from", "type": "ByStr20" },
          { "vname": "to", "type": "ByStr20" },
          { "vname": "token", "type": "ByStr20" },
          { "vname": "amount", "type": "Uint256" },
          { "vname": "nonce", "type": "Uint256" },
          { "vname": "proofs", "type": "List (Pair (ByStr20) (ByStr64))" }
        ]
      },
      { "vname": "Pause", "params": [] },
      { "vname": "Unpause", "params": [] },
      {
        "vname": "AddChainToken",
        "params": [
          { "vname": "chainId", "type": "String" },
          { "vname": "token", "type": "ByStr20" },
          { "vname": "is_other_chain", "type": "Bool" }
        ]
      },
      {
        "vname": "RemoveChainToken",
        "params": [
          { "vname": "chainId", "type": "String" },
          { "vname": "token", "type": "ByStr20" }
        ]
      },
      {
        "vname": "UpdateNodeManager",
        "params": [ { "vname": "new_node_manager", "type": "ByStr20" } ]
      },
      {
        "vname": "DistributeRewards",
        "params": [ { "vname": "distributor", "type": "ByStr20" } ]
      },
      {
        "vname": "UpdateGRPHFeeAmount",
        "params": [ { "vname": "amount", "type": "Uint128" } ]
      },
      {
        "vname": "RecipientAcceptTransferFrom",
        "params": [
          { "vname": "sender", "type": "ByStr20" },
          { "vname": "recipient", "type": "ByStr20" },
          { "vname": "amount", "type": "Uint128" }
        ]
      },
      {
        "vname": "TransferFromSuccessCallBack",
        "params": [
          { "vname": "sender", "type": "ByStr20" },
          { "vname": "recipient", "type": "ByStr20" },
          { "vname": "amount", "type": "Uint128" }
        ]
      },
      {
        "vname": "RecipientAcceptTransfer",
        "params": [
          { "vname": "sender", "type": "ByStr20" },
          { "vname": "recipient", "type": "ByStr20" },
          { "vname": "amount", "type": "Uint128" }
        ]
      },
      {
        "vname": "RecipientAcceptMint",
        "params": [
          { "vname": "minter", "type": "ByStr20" },
          { "vname": "recipient", "type": "ByStr20" },
          { "vname": "amount", "type": "Uint128" }
        ]
      },
      {
        "vname": "MintSuccessCallBack",
        "params": [
          { "vname": "minter", "type": "ByStr20" },
          { "vname": "recipient", "type": "ByStr20" },
          { "vname": "amount", "type": "Uint128" }
        ]
      }
    ],
    "events": [
      {
        "vname": "GRPHFeeAmountUpdated",
        "params": [ { "vname": "amount", "type": "Uint128" } ]
      },
      {
        "vname": "NodeManagerUpdated",
        "params": [ { "vname": "node", "type": "ByStr20" } ]
      },
      {
        "vname": "TokenChainDeleted",
        "params": [
          { "vname": "chainId", "type": "String" },
          { "vname": "token", "type": "ByStr20" }
        ]
      },
      {
        "vname": "TokenToChainAdded",
        "params": [
          { "vname": "chainId", "type": "String" },
          { "vname": "token", "type": "ByStr20" }
        ]
      },
      { "vname": "ContractUnpased", "params": [] },
      { "vname": "ContractPased", "params": [] },
      {
        "vname": "TokenChainTransferClaimed",
        "params": [
          { "vname": "submissionId", "type": "ByStr32" },
          { "vname": "chainId", "type": "String" },
          { "vname": "from", "type": "ByStr20" },
          { "vname": "to", "type": "ByStr20" },
          { "vname": "token", "type": "ByStr20" },
          { "vname": "amount", "type": "Uint256" },
          { "vname": "nonce", "type": "Uint256" }
        ]
      },
      {
        "vname": "TokenChainTransfer",
        "params": [
          { "vname": "submissionId", "type": "ByStr32" },
          { "vname": "chainId", "type": "String" },
          { "vname": "from", "type": "ByStr20" },
          { "vname": "to", "type": "ByStr20" },
          { "vname": "token", "type": "ByStr20" },
          { "vname": "amount", "type": "Uint256" },
          { "vname": "nonce", "type": "Uint256" }
        ]
      }
    ],
  }
  
  