# How To Contribute?

# Git Flow (Working With Existing Branches)
1. git clone https://github.com/woXrooX/x
2. git branch -r (Shows remote branches) And git fetch --all (Pulls all remote branches)
3. git checkout feature/menu
4. git pull
5. git merge "dev"
6. Solve Conflicts If Exists (Always Choose "dev")
7. git commit -m "Message"
8. git push. -> Now your branch is up to date and ready to use
9. Start working on your feature
10. LIVE: Code Review
11. Merge to "dev" branch
12. "dev" will be merged to "main" branch after reviews

# Git Publish New Branches To Remote (Working With New Branches)
1. git checkout -b feature/newBranchName
2. git push -u origin feature/newBranchName

# Default Branches To Use
- main
- dev

- feature/loading
- feature/logIn
- feature/logOut
- feature/menu
- feature/paymentSystem
- feature/signUp
- feature/UISystem

- tool/pageGuard

- assets
- database

- tmp/[name]
