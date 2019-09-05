class Level {
  constructor(level, stages) {
    this.level = level;
    this.stages = stages;
    this.currentStage = 0;

    this.maps = [[4,4,4,4,4,4,4,4,4,4,
                  4,4,4,4,4,4,4,4,4,4,
                  4,4,4,4,4,4,4,4,4,16,
                  4,4,4,4,4,4,3,4,4,4,
                  4,4,4,3,4,4,16,4,4,4,
                  4,4,4,4,4,4,4,4,4,4,
                  1,1,1,1,1,2,4,4,0,1,
                  6,6,6,6,6,7,4,4,5,6],
                 [4,4,4,4,4,4,4,4,4,4,
                  4,4,4,4,4,4,4,4,4,4,
                  4,4,4,4,4,4,4,4,4,4,
                  4,4,4,4,4,4,4,4,4,4,
                  4,4,4,4,4,4,4,4,4,4,
                  4,4,4,4,4,4,4,4,4,4,
                  1,2,4,4,0,2,4,4,0,1,
                  6,7,4,4,5,7,4,4,5,6],
                 [4,4,4,4,4,4,4,4,4,4,
                  4,4,4,4,4,4,4,4,4,4,
                  4,4,4,4,4,4,4,4,4,4,
                  4,4,4,4,4,4,4,4,4,4,
                  4,4,4,4,4,4,4,4,4,4,
                  4,4,4,0,2,4,4,4,4,4,
                  1,2,4,5,7,4,4,4,0,1,
                  6,7,4,5,7,4,4,4,5,6],
                 [4,4,4,4,4,4,4,4,4,4,
                  4,4,4,16,4,4,4,4,4,4,
                  4,4,4,4,4,4,4,4,4,16,
                  4,4,4,4,4,4,3,4,4,4,
                  4,4,4,3,4,4,4,4,4,4,
                  4,4,4,16,4,4,4,4,16,4,
                  1,2,4,4,4,4,4,4,4,4,
                  6,7,4,4,4,4,16,4,4,4]];

    this.enemiesMaps = [[["bag", 9, 2],["bag", 5, 5.25],["bag", 3, 1],["bag", 7, 4]],
                        [["bag", 9, 2],["bag", 9, 2],["bag", 9, 2],["bag", 9, 2]],
                        [["bag", 9, 2],["bag", 9, 2],["bag", 9, 2],["bag", 9, 2]],
                        [["bag", 9, 2],["bag", 9, 2],["bag", 9, 2],["bag", 9, 2]]
                       ]

  }

}