# BNB Chain Developer Tooling Landscape

This landscape represents a comprehensive list of tools that developers use when developing smart contracts on the BNB Chain, including BNB Smart Chain, opBNB Chain, and Greenfield Chain. 


## Contributing 
Contributions are welcome! Feel free to submit a pull request, with anything from small fixes to tools you'd like to add (or remove!). To suggest any changes to the entries or the categories, modify the data.json file and open a pull request.


** To add new tools or update existing ones, please submit the info according to the table below: **


| Required               | Parameters       | Description                                                          | Notes                                                         |
|------------------------|------------------|----------------------------------------------------------------------|---------------------------------------------------------------|
| Yes                    | name             | Avail Deposit                                                        | 20 characters max, including numbers, letters, and blanks     |
| Yes                    | logo             | Input the link to your tool’s logo                                   | Format: 40x40 pixs Prefer SVG files                           |
| Yes                    | category         | DeFi Development                                                     | If you need a new category, please specify in the annotation. |
| Yes                    | groupTitle       | Deposit Widgets                                                      | If you need a new group, please specify in the annotation.    |
| Yes                    | website          | https://availproject.org/nexus/deposit                               | Format auto-check                                             |
| Yes                    | desc             | Cross-chain deposit widget that enables users to deposit assets from multiple chains into a dApp in a single flow. It abstracts away bridging, gas tokens, and chain switching to improve user onboarding UX.                                                     | 1000 characters max                                           |
| Yes (only for Wallets) | isSupportStaking | false                                                                | Values: true or false                                         |
| Yes                    | chains           | bsc                                                                  | Values: bsc, opbnb, greenfield                                |
| Yes                    | Annotation       | Contact: soumyajit@availproject.org Company: Avail Project

Requesting a new groupTitle under DeFi Development: "Deposit Widgets".

Reason:
Deposit tools represent a distinct layer in the DeFi user journey, focused specifically on enabling users to fund applications. These tools differ from bridges and wallets by abstracting multi-chain complexity into a single deposit flow, improving onboarding and conversion.

This category would help group tools that:
- Enable deposits from multiple chains
- Abstract bridging and gas complexity
- Simplify user onboarding into dApps

Adding Avail Deposit as the first entry in this category.

Website: https://availproject.org/nexus/deposit 

Happy to align this under an existing category if preferred.                                |                                                               |
| Yes                    | tags             | DeFi                               |     Values: Game, DeFi, AI, DeSoc, All. can select one, multiple, or All tags |
