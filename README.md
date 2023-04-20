# Project Wakanda: API

## Project setup
> Installs dependencies
```
npm install
```

### Run Server
> Gets the server going
```
node server
```

Wakanda
Quotes API:
    receive request sent in
    read headder data (merchant Ids)
    validate request data
    pull merchant settings
    pull payment settings (market rate?)
    save quote to collection with ID
    Collection:
        id
        network
        payment_method
        market_price
        source_exchange
        payment_method_markup
        merchant_markup
        quote_price
        request_count
        ip = []
        created
        expires
        merchant_id
        store_id
    request:
        payment_method
        base_currency
        network
    response:
        network
        base_currency
        price_per_unit
        quote_id
        created
        expires
Merchant Collection:
Processor Collection:
    payment_method
    payment_method_markup
    internal_markup
    created
    updated
Transaction API:
    Collection:
        id
        quote_id
        amount
        payment_details = {}
        wallet_address
        ip
        created
        payment_method_status
        network_transaction_status
        wallet_provider
        payment_method_response
        network_transaction_response
        user_id
        ###add phone/user id
    request:
        network
        quote_id
        amount
        payment_details = {}
        wallet_address
    response:
after getting quote ->
purchase flow:
    get request
    read header data
    validate request
    get merchant settings
    get quote settings
    validate quote
    confirm quote is profitable
    check block.io balance
    flexipin transaction
    send response ->
    Balance trade
    make counter trade
    refill block.io wallet
Request OTP:
    send request (phone#, country code)
    verify request
    validate parameters
    generate 4 digit SMS verification code (OTP - one time password)
    store code DB
    send response to phone #
    Collection:
        id
        phone_number
        country_code
        otp_code
        created
        expires
        attempts
        completed
        one_time_token
        token_used
        quote_id
        token_expires
        ip
    request:
        quote_id
        phone_number
        country_code
    response:
Confirm OTP:
    send request
    verify request
    lookup code id
    compare codes
    security check
    update code in DB
    generate one time token
    send response
    request:
        otp_code
        otp_code_id
        quote_id
Major Tasks:
OTP code - Tyson
flexipin payment service - Rod
quote request - Sean
UI - Declan
rebalancing service - Sean
purchase flow - Rod
