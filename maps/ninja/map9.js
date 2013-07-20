{
    "logicobjs": {
        "spikes": [
            {
                "position": {
                    "x": 150,
                    "y": 800
                }
            },
            {
                "position": {
                    "x": 450,
                    "y": 800
                }
            },
            {
                "position": {
                    "x": 750,
                    "y": 800
                }
            },
            {
                "position": {
                    "x": 1050,
                    "y": 800
                }
            }
        ],
        "emitters": [
            {
                "sequence": {
                    "cooly": {
                        "hability": "none",
                        "velocity": 5
                    },
                    "many": 40,
                    "time": 250
                },
                "position": [
                    85,
                    85
                ]
            }
        ],
        "catchers": [
            {
                "position": [
                    950,
                    120
                ],
                "pass": {
                    "coolies": 15
                },
                "star1": {
                    "coolies": 30
                },
                "star2": {
                    "coolies": 15,
                    "touches": 3
                },
                "star3": {
                    "coolies": 40,
                    "touches": 3
                }
            }
        ]
    },
    "grounds": [
        {
            "shape": [
                {
                    "x": 100,
                    "y": -100
                },
                {
                    "x": 100,
                    "y": 100
                },
                {
                    "x": -100,
                    "y": 100
                },
                {
                    "x": -100,
                    "y": -100
                }
            ],
            "position": {
                "x": 500,
                "y": 500
            }
        }
    ],
    "powers": [
        "anti",
        "accele",
        "anti"
    ]
}
