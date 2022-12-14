import { Assassin } from "./assassin";
import { Character } from "./character";
import { Dragon } from "./dragon";
import { Enemy } from "./enemy";
import { Griffin } from "./griffin";
import { Hero } from "./hero";


export class Battle {

    hero: Hero;

    enemy: Enemy;

    constructor(hero: Hero, enemy: Enemy) {
        this.hero = hero;
        this.enemy = enemy;
    }

    affichageStat(tableau: any,tableau2: any) {

        const affichage: HTMLElement | any = document.getElementById('combat');

        let output: string = `
        <div>
        <tr>
            <th class="pt-4" scope="row" rowspan="2">0</th>
            <td>name: ${tableau[0]} , health: ${tableau[1]}, strength: ${tableau[2]}, lvl: ${tableau[3]}, xp: ${tableau[4]}, race: ${tableau[5]}</td>
        </tr>
        <tr>
            
            <td>name: ${tableau2[0]} , health: ${tableau2[1]}, strength: ${tableau2[2]}, lvl: ${tableau2[3]}, xp: ${tableau2[4]}</td>
        </tr>
    </div>
    `;
            affichage.innerHTML += output;
        
    }
    affichageTour(tableauHero: any,tableauEnemy: any, tour: number) {

            const affichage: HTMLElement | any = document.getElementById('combat');

            let output: string = `
            <div>
            <tr>
                <th class="pt-4" scope="row" rowspan="2">${tour}</th>
                <td>${tableauHero[0]} attaque avec une force de :${tableauHero[2].toFixed(1)}</td>
            </tr>
            <tr>
                <td>${tableauEnemy[0]} recoit ${tableauHero[2].toFixed(1)} de dégats, ${tableauEnemy[0]} health passe a ${tableauEnemy[1].toFixed(1)} de points de vie. ${this.affichageDeath(tableauHero,tableauEnemy)}</td>
            </tr>
        </div>`;
                affichage.innerHTML += output;
    }
    affichageVictoire(tableauHero,tableauEnemy){
        const affichage: HTMLElement | any = document.getElementById('combat');

        let output: string = `
        <div>
        <tr><th class="pt-4" scope="row" rowspan="2">Fin de Kombat</th>
        ${this.affichageXpUp(tableauHero[0])}</tr>
        <tr>
        ${this.affichageHealthUp(tableauHero,tableauEnemy)}
        </tr>
        <div>
        </div>
        <tr><th class="pt-4" scope="row" rowspan="2">Nouvelles Stats</th>
        <td>name: ${tableauHero[0]} , health: ${tableauHero[1].toFixed(1)}, strength: ${tableauHero[2]}, lvl: ${tableauHero[3]}, xp: ${tableauHero[4]}, race: ${tableauHero[5]}</td>
        </tr><td>THE END !!!</td>
        </div>
    `;
            affichage.innerHTML += output;

    }
    affichageXpUp(name){
        const affichage: HTMLElement | any = document.getElementById('combat');
        let output: string = '';
        return output = `
        <td>
        L'xp de ${name} augmente de 2.
        </td>
    `;
            
        
    }
    affichageHealthUp(tableauHero,tableauEnemy){
        const affichage: HTMLElement | any = document.getElementById('combat');

        let healthEnemy = tableauEnemy[1].toFixed(1);
        let healthUp = (tableauEnemy[1] * 0.1).toFixed(1) ;

        let output: string = '';
        return output = `<td>
        ${tableauHero[0]} recupere 10% de health de ${tableauEnemy[0]}, ${healthEnemy}* 0.1 = ${healthUp} .
        </td>
    `;
    }
    affichageDeath(tableauHero,tableauEnemy){
            if(this.hero.getHealth() <= 0){return this.hero.die()};
            if(this.enemy.getHealth() <= 0){return this.enemy.die()};
            if(tableauHero[1] > 0 || tableauEnemy[1] > 0 ){return ""}
    }
    declare(): void {
        console.log((this.hero.stat(),this.enemy.stat()));
        
        this.affichageStat(this.hero.stat(),this.enemy.stat());
        let initEnemyStat = this.enemy.stat();
        //const initTour = 1;
        let tour = 1;
        let countAffichage = 1;

        while ((!this.hero.notAlive()) && (!this.enemy.notAlive())) { // while (this.hero.getHealth() > 0 && this.enemy.getHealth() > 0) {
            //console.log(`TOUR ${tour}`)
            //console.log(countAffichage);
            
            this.hero.attack(this.enemy)
            this.affichageTour(this.hero.stat(),this.enemy.stat(), countAffichage);
            //console.log(this.enemy)
            
            ++tour
            ++countAffichage
            //console.log(`TOUR ${tour}`)
            //console.log(countAffichage);

            if (this.enemy instanceof Assassin) {
                this.enemy.attackAssassin(this.hero);
            }

            if (!(this.enemy instanceof Assassin) && !(this.enemy instanceof Dragon) && !(this.enemy instanceof Griffin)) {
                this.enemy.attack(this.hero);
            }

            if ((this.enemy instanceof Dragon) || (this.enemy instanceof Griffin)) {
                if (tour === 2) {
                    this.enemy.attack(this.hero);
                }
                else if (tour === 4) {
                    this.enemy.attack(this.hero);
                    this.enemy.flight();
                }
                else if (tour === 6) {
                    this.enemy.attackFromSky(this.hero);
                    this.enemy.fly = false;
                }
            }

            //console.log(this.hero);
            if(this.enemy.getHealth() > 0){
                this.affichageTour(this.enemy.stat(),this.hero.stat(),countAffichage)
            }
            ++tour
            ++countAffichage
            //console.log(`TOUR ${tour}`)
            //console.log(countAffichage);
            

            if (tour > 6) {
                tour = 1
                //console.log(`RESET TOUR`)
            }

            
        }
        //console.log(this.hero, this.enemy);

        if (this.enemy.notAlive()) {
            this.xpUp(this.hero);
            this.healthUp(this.hero);
            this.affichageVictoire(this.hero.stat(),initEnemyStat);
        } else { console.log(this.hero.die()) };
        //console.log(this.hero, this.enemy);
        return;
    }

    xpUp(hero: Character) {
        hero.setXp(hero.getXp() + 2);
        this.lvlUp(hero);
    }

    lvlUp(hero: Character) {
        if (hero.getXp() === 10) {
            hero.setStrength(hero.getStrength() + 10);
            hero.setLvl(hero.getLvl() + 1);
        }
    }

    healthUp(hero: Character): number {
        return hero.setHealth(hero.getHealth() + (this.enemy.getHealth() * 0.1));
    }
}
