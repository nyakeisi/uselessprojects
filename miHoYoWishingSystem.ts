// I tried to recreate wishing system that miHoYo is using in their latest games and actually succeded on making it as close as possible. 
// The results are practially the same as in game and there is even a guarantee system!
// Main functions are getFiveStarChance() and getFourStarChance(), where they calculate current chance of getting a certain rarity item or character.
// Four star: 1-7 pulls have a base chance of 5.1% of getting a four star. 8-9 pulls have higher chances of ~25% and ~50% respectfully, and 10th is guaranteed.
// Five star: 1-73 pulls have a base chance of 0.6% of getting a five star. 74-89 pulls grow with each pull using a formula: BASE CHANCE + (PULL - 73) * GROWTH CHANCE.
// We don't really know what growth chance is, but 6% with each pull is actually a very close result, making a pretty smooth growth from 0.6% to ~97% on 89th pull.
// And of course 90th pull is gonna be a guaranteed five star.

type PullResult = {
    result: 3 | 4 | 5, // rarity.
    id: string, // just a response.
    resultType: 1 | 2 | 3 // 1 - lost 50/50, 2 - won 50/50, 3 - guaranteed.
}

export class WishingSystem {
    public pullsSinceLastFourStar: number = 0;
    public pullsSinceLastFiveStar: number = 0;
    public isGuaranteedFourStar: boolean = false;
    public isGuaranteedFiveStar: boolean = false;

    set(fourStar: number, fiveStar: number, isGuaranteedFourStar: boolean, isGuaranteedFiveStar: boolean) {
        this.pullsSinceLastFourStar = fourStar;
        this.pullsSinceLastFiveStar = fiveStar;
        this.isGuaranteedFourStar = isGuaranteedFourStar;
        this.isGuaranteedFiveStar = isGuaranteedFiveStar;
    }

    getFiveStarChance(): number {
        const pull = this.pullsSinceLastFiveStar;
        if (pull < 1) return 0;
        if (pull <= 73) return 0.006;
        if (pull >= 74 && pull <= 89) return 0.006 + (pull - 73) * 0.06;
        return 1;
    }

    getFourStarChance(): number {
        const pull = this.pullsSinceLastFourStar;
        const baseChance = 0.051;
        if (pull >= 9) return 1;
        if (pull <= 7) return baseChance;
        return baseChance + (pull - 7) * 0.2;
    }

    pull() {
        const fiveStarChance = this.getFiveStarChance();
        const fourStarChance = this.getFourStarChance();

        const roll = Math.random(), rollFiftyFifty = Math.floor(Math.random() * (2 - 1 + 1) + 1);

        if (roll < fiveStarChance) {
            let PullResult: PullResult = { 
                result: 5, 
                id: (
                    this.isGuaranteedFiveStar ? 
                    "You've won a guaranteed limited 5★" : 
                    rollFiftyFifty == 2 ? 
                        "You've won 50/50 and got a limited 5★" : 
                        "You've lost 50/50 and got a standard 5★"
                ), 
                resultType: (this.isGuaranteedFiveStar ? 3 : (rollFiftyFifty == 2 ? 2 : 1)) 
            }
            this.set(this.pullsSinceLastFourStar + 1, 0, this.isGuaranteedFourStar, (rollFiftyFifty == 2 || this.isGuaranteedFiveStar == true) ? false : true)
            return PullResult
        } 
        else if (roll < fiveStarChance + fourStarChance) {
            let PullResult: PullResult = { 
                result: 4, 
                id: (
                    this.isGuaranteedFourStar ? 
                        "You've won a guaranteed limited 4★" : 
                        rollFiftyFifty == 2 ? 
                            "You've won 50/50 and got a limited 4★" : 
                            "You've lost 50/50 and got a standard 4★"
                ), 
                resultType: (this.isGuaranteedFourStar ? 3 : (rollFiftyFifty == 2 ? 2 : 1)) 
            }
            this.set(0, this.pullsSinceLastFiveStar + 1, (rollFiftyFifty == 2 || this.isGuaranteedFourStar == true) ? false : true, this.isGuaranteedFiveStar)
            return PullResult
        }
        else {
            let PullResult: PullResult = { 
                result: 3, 
                id: "You've got a regular 3★", 
                resultType: 3 
            }
            this.set(this.pullsSinceLastFourStar + 1, this.pullsSinceLastFiveStar + 1, this.isGuaranteedFourStar, this.isGuaranteedFiveStar)
            return PullResult
        }
    }
}

// Renarde Rose



// Below is a test for how the wishing simulator works, don't include it in your project:
(async() => {
    const ws = new WishingSystem();
    ws.set(5, 74, false, false) // we expect a 50/50 on a soft pity or higher for a 5* character.
    for (let i = 0; i < 10; i++) {
        let res = ws.pull()
        console.log(res.id+"\n")
    }
})();
