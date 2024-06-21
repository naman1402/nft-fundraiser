import { run } from "hardhat"

const verify = async (Address: string, args: any[]) => {
    console.log("verfying contract ..")
    console.log(args)


    try {
        await run("verify: ", {
            address: Address,
            constructorArguments: args,
        })
    } catch (e: any) {
        if (e.message.toLowerCase().includes("already verified")) {
            console.log("contract is already verified")
        } else {
            console.log(e)
        }
    }
}


export default verify