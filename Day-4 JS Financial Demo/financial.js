//BASE FINANCIAL ACCOUNT
class FinancialAccount {
    constructor(accountNumber, accountHolder, balance = 0) {
        this.accountNumber = accountNumber;
        this.accountHolder = accountHolder;
        this._balance = balance;
        this.transactions = [];
    }
    get balance() {
        return this._balance;
    }
    deposit(amount, desc = "Deposit") {
        this._balance += amount;
        this._record(amount, "credit", desc);
    }
    withdraw(amount, desc = "Withdrawal") {
        if (amount > this._balance) throw new Error("Insufficient funds");
        this._balance -= amount;
        this._record(amount, "debit", desc);
    }
    _record(amount, type, description) {
        this.transactions.push({
            id: this.transactions.length + 1,
            date: new Date(),
            amount,
            type,
            description,
            balanceAfter: this._balance
        });
    }
}
//INSURED SAVINGS ACCOUNT
class InsuredSavingsAccount extends FinancialAccount {
    constructor(accNo, holder, balance, insuranceType) {
        super(accNo, holder, balance);
        this.insuranceType = insuranceType;
    }
}
//FETCH & CREATE ACCOUNTS
async function createAccounts() {
    const res = await fetch("https://dummyjson.com/users");
    const data = await res.json();
    return data.users.slice(0, 5).map((u, i) => {
        const acc = new InsuredSavingsAccount(
            `ACC${1001 + i}`,
            u.firstName,
            Math.floor(Math.random() * 3000) + 2000,
            i % 2 === 0 ? "Health Insurance" : "Life Insurance"
        );
        // seed transactions
        acc.deposit(1000, "Initial Deposit");
        acc.withdraw(400, "Shopping");
        acc.deposit(700, "Salary Credit");

        return acc;
    });
}

//DISPLAY ALL ACCOUNTS TABLE 1
function showAllAccounts(accounts) {
    const tableData = accounts.map(acc => ({
        accountNumber: acc.accountNumber,
        holder: acc.accountHolder,
        balance: acc.balance,
        insurance: acc.insuranceType
    }));

    console.log("\nALL ACCOUNT HOLDERS");
    console.table(tableData);
}

//DISPLAY TRANSACTIONS BY ACCOUNT TABLE 2
function showTransactions(accounts, accountNumber) {
    const account = accounts.find(a => a.accountNumber === accountNumber);

    if (!account) {
        console.log("Invalid Account Number");
        return;
    }
    console.log(`\nTRANSACTIONS FOR ${account.accountNumber} (${account.accountHolder})`);
    console.table(account.transactions);
}

(async function runBankingDemo() {
    const accounts = await createAccounts();

    // TABLE 1: All account holders
    showAllAccounts(accounts);

    // Test input for account number
    const enteredAccountNumber = "ACC1002";

    // TABLE 2: Transactions for selected account
    showTransactions(accounts, enteredAccountNumber);
})();
