var CURRENT_VERSION = 2017042800

var PLAYER_NAME_MAX_LENGTH = 20;
var RESET_NAMES_DEFAULT = false;
var DEBUG_AUTO_ADVANCE_DELAY = 75;
var DEBUG_WIN_AUTO_ADVANCE_DELAY = 5000;
var DEBUG = false;
var debugPaused = false;
var UNDO_LENGTH = 20;

var resetNames = RESET_NAMES_DEFAULT; //used in deal
var TIMER_SKIP = 60;
var TIMER_EXTENSION = 45;

var playerIndex;		// 플레이어 row index
var notUndoflag = false;

var phaseStyleDict = {"Game Start":		"gs",
					  "Day":			"dy",
					  "Night":			"nt",
					  "Village Win":	"vw",
					  "Witch Win":		"ww",
					  }

var masterTeamDict = {   0: "<span class='peasant'>Village Peasant</span>",
					     1: "<span class='clergy'>Holy Villager</span>",
					  '-1': "<span class='witch'>Witch</span>",
					  }

var abbrevTeamDict = {   0: "<img src='img/teamicons/teamicon_village.png'>",
					     1: "<img src='img/teamicons/teamicon_clergy.png'>",
					  '-1': "<img src='img/teamicons/teamicon_witch.png'>",
					  }

var masterRoleDict = { 0: "Priest",
					   1: "Judge",
					   2: "Gravedigger",
					   3: "Apprentice",
					   4: "Survivalist",
					   5: "Dirty Old Bastard",
					   6: "Gambler",
					   7: "Fanatic",
					   8: "Oracle",
					   9: "Watchman",
					  10: "Hunter",
					  11: "Peeping Tom",
					  12: "Loose Cannon",
					  13: "Nurse",
					  14: "Inquisitor",
					  15: "Emissary",
					  16: "Acolyte",
					  17: "Benevolent Old Dame",
					  18: "Bomber",
					  19: "Assassin",
					  20: "Spiritualist",
					  21: "Fortune Teller",
					  }

var abbrevRoleDict = { 0: "<div class='roleicon'><img src='img/roleicons/roleicon_priest.jpg'><span class='vertical'>Priest</span></div>",
					   1: "<div class='roleicon'><img src='img/roleicons/roleicon_judge.jpg'><span class='vertical'>Judge</span></div>",
					   2: "<div class='roleicon'><img src='img/roleicons/roleicon_gravedigger.jpg'><span class='vertical'>Digger</span></div>",
					   3: "<div class='roleicon'><img src='img/roleicons/roleicon_apprentice.jpg'><span class='vertical'>Appren</span></div>",
					   4: "<div class='roleicon'><img src='img/roleicons/roleicon_survivalist.jpg'><span class='vertical'>Survival</span></div>",
					   5: "<div class='roleicon'><img src='img/roleicons/roleicon_dob.jpg'><span class='vertical'>D.O.B.</span></div>",
					   6: "<div class='roleicon'><img src='img/roleicons/roleicon_gambler.jpg'><span class='vertical'>Gambler</span></div>",
					   7: "<div class='roleicon'><img src='img/roleicons/roleicon_fanatic.jpg'><span class='vertical'>Fanatic</span></div>",
					   8: "<div class='roleicon'><img src='img/roleicons/roleicon_oracle.jpg'><span class='vertical'>Oracle</span></div>",
					   9: "<div class='roleicon'><img src='img/roleicons/roleicon_watchman.jpg'><span class='vertical'>Watch</span></div>",
					  10: "<div class='roleicon'><img src='img/roleicons/roleicon_hunter.jpg'><span class='vertical'>Hunter</span></div>",
					  11: "<div class='roleicon'><img src='img/roleicons/roleicon_peepingtom.jpg'><span class='vertical'>Tom</span></div>",
					  12: "<div class='roleicon'><img src='img/roleicons/roleicon_loosecannon.jpg'><span class='vertical'>Cannon</span></div>",
					  13: "<div class='roleicon'><img src='img/roleicons/roleicon_nurse.jpg'><span class='vertical'>Nurse</span></div>",
					  14: "<div class='roleicon'><img src='img/roleicons/roleicon_inquisitor.jpg'><span class='vertical'>Inquis</span></div>",
					  15: "<div class='roleicon'><img src='img/roleicons/roleicon_emissary.jpg'><span class='vertical'>Emisry</span></div>",
					  16: "<div class='roleicon'><img src='img/roleicons/roleicon_acolyte.jpg'><span class='vertical'>Acolyte</span></div>",
					  17: "<div class='roleicon'><img src='img/roleicons/roleicon_bod.jpg'><span class='vertical'>B.O.D.</span></div>",
					  18: "<div class='roleicon'><img src='img/roleicons/roleicon_bomber.jpg'><span class='vertical'>Bomber</span></div>",
					  19: "<div class='roleicon'><img src='img/roleicons/roleicon_assassin.jpg'><span class='vertical'>Assassin</span></div>",
					  20: "<div class='roleicon'><img src='img/roleicons/roleicon_spiritualist.jpg'><span class='vertical'>Spirit</span></div>",
					  21: "<div class='roleicon'><img src='img/roleicons/roleicon_fortuneteller.jpg'><span class='vertical'>Fortune</span></div>",
					  }

var categoryRoleDict={ 0: "Holy",
					   1: "Offensive",
					   2: "Informative",
					   3: "Informative",
					   4: "Defensive",
					   5: "Offensive",
					   6: "Defensive",
					   7: "Defensive",
					   8: "Informative",
					   9: "Informative",
					  10: "Offensive",
					  11: "Informative",
					  12: "Offensive",
					  13: "Defensive",
					  14: "Informative",
					  15: "Defensive",
					  16: "Holy",
					  17: "Defensive",
					  18: "Offensive",
					  19: "Offensive",
					  20: "Informative",
					  21: "Informative",
					  }

var deathLocationStringDict = { 0: " Across from the Alehouse",
							    1: " Beneath a Bridge",
								2: " Close to the Church",
								3: " Down by the Docks",
								4: " Round the Riverbend",
								5: " in Front of the Fields",
								6: " Towards the Turnpike",
								7: " Halfway down a Hill",
								8: " Inside the Inn",
								9: " Stuffed inside a Scarecrow",
							   10: " Within a Well",
							   11: " Left in a Lake",
							   12: " in the Middle of Nowhere",
							   13: " Vanquished in the Valley",
							   14: " Perched on a Pig Pen",
							   15: " Under the Underbrush",
							   77: "",
							   }

var bonusWitchRatiosDict = { 3: -1, //appr
							 4: -1, //Surv
							 5: -1, //DOB
							 6:  1, //Gambler
							 8:  2, //Oracle
							 9:  2, //Watchman
							12: -2, //LC
							13:  1, //Nurse
							15:  1, //Emissary
							16:  4, //acolyte
							17:  2, //BOD
							18: -1, //bomber
							19: -2, //assassin
							20:  1, //spiritualist
							}

var imgRoleDict = { 0: "priest",
					1: "judge",
					2: "gravedigger",
					3: "apprentice",
					4: "survivalist",
					5: "dob",
					6: "gambler",
					7: "fanatic",
					8: "oracle",
					9: "watchman",
					10: "hunter",
					11: "peepingtom",
					12: "loosecannon",
					13: "nurse",
					14: "inquisitor",
					15: "emissary",
					16: "acolyte",
					17: "bod",
					18: "bomber",
					19: "assassin",
					20: "spiritualist",
					21: "fortuneteller",
					}	

var imgTeamDict = {	0: "village",
					1: "clergy",
				   '-1': "witch",
				 }						

var computeWitchCount = function(myRoleList) {
	debugger
	var rawWitchCount = Math.pow(myRoleList.length - 5, 0.5) + 1;
	if (myRoleList.length > 5) {
		var myBonus = 0;
		for (var index in myRoleList) {
			var role = myRoleList[index];
			if (role in bonusWitchRatiosDict) {
				myBonus += bonusWitchRatiosDict[role];
			}
		}
		rawWitchCount += (myRoleList.length - 5) * myBonus / 90;
	}
	if (rawWitchCount > 5)
	{
		rawWitchCount = 5;
	}
	return Math.floor(rawWitchCount);
}

var masterHolyRoleList = [0,16];
// var masterMandatoryRoleList = [0,1,2,3,4];
var masterMandatoryRoleList = [];
var masterDisabledRoleList = [];
var masterElectiveRoleList = [0,1,2,3,4,5,6,7,8,9,10,15,12,19,13,20,17,16,18,11,21,14];
var myPriorityRoleList = [/*5,6,7,8,9,10,11*/];

var advancedRules = false;
var villageHandicap = false;
var witchHandicap = false;

var autoSteps = null; // actually used
var confirmTarget = false;
var confirmChoice = false;
var confirmRole = true;
var currentRename = null;
var nextRename = null;
var highlightRoleIndexList = [];
var highlightTeamIndexList = [];

var gameStack = [];
var g; //current game
var prevGame // previous game

function game() {

	this.currentPhase = "Deal";
	this.prevTarget = 77; //for undo
	this.stepCompleted = false;
	this.stepList = STEP_dict[this.currentPhase].slice(0);
	this.legalInputList = [];

	this.hideRoles = false;

	this.currentStepLength = null;
	this.targetTime = null;
	this.pausedTimeLeft = null;
	this.interruptPausedTimeLeft = null;
	this.linkList = [];
	this.deadRole = false;
	this.bannedRole = false;

	this.playerList;
	this.aliveNum;
	this.cycleNum = 0;
	this.interruptStepList = [];
	this.tempTarget; //used for assassin
	this.deathLocationDict = {};
	this.deathLocationStack = [];
	this.bombHolder = null;
	this.hunterNight = null;

	this.peepingTomTrigger = false;
	this.peepingTomAvailable = null; //assign player index to this var
	this.peepingTomActive = null; //peeping tom active on current step
	this.wakeupList = []; //for watchman
	this.angelTutorialStep = 0; //0-nothing, 1-basics only, 2 - "curse", 3-double protect
	this.angelMessage = null; //temp var used to save angel messages between states
	this.soloName = null; //name of only dead player
	this.gravediggerTrigger = false; //is the gravedigger getting any info tonight?
	this.doubleProtectUsed = false;
	this.angelProtectList = [];
	this.hauntingTargetList = [];
	this.illusionKillAvailable = false;
	this.nightProtectList = [];
	this.nightKillList = [];
	this.nightSurvivalList = [];
	this.lastPriestCheck = null;
	this.forfeitFlag = null;

	this.log = "";
	this.logData = [0,0,0,0,0,0]

	this.version = CURRENT_VERSION;

	for (var key in deathLocationStringDict) {
		if (key != null && key != 77) { //77 is default
			this.deathLocationStack.push(key);
		}
	}
	shuffle(this.deathLocationStack);

	return this;
}

function player(name) {
	this.name = name;
	this.team = null;
	this.role = null;
	this.covenJoinCycleNum = null;
	this.courtJoinCycleNum = null;
	this.choice = null; //0 is even/GD, 1 is odd/Judge, 77 is None
	this.revealed = 0;
	this.used = 0;
	this.extraLives = 0;
	this.deathCyclePhase = null;
	this.deathCycleNum = null;
	this.isBanned = false;
	this.protectionInvalid = false;
	return this;
}

function setupGame() {
	if (g != null) {
		prevGame = g;
	}
	g = null;
	$('#restoreModal').modal('hide');
	$('#playerTable').show();
	$('.control-button-volume').addClass("disabled");
	$('.settings-button').addClass("disabled");
	updateView(); //go to gameSettings
}

function clickRoleButton(target) {
	if (myPriorityRoleList.indexOf(target) == -1) {
		myPriorityRoleList.push(target);
	} else {
		myPriorityRoleList.splice(myPriorityRoleList.indexOf(target),1);
	}
	refreshRolesSelectedCountMessage();
}

function refreshRolesSelectedCountMessage() {
	var myRoleList = masterMandatoryRoleList.concat(myPriorityRoleList);
	var myMessage = "";
	myMessage += "<p class='modSecret'>You have selected " + myRoleList.length + " characters.<br>";
	myMessage += "This game will have " + computeWitchCount(myRoleList) + " Witches.</p>";
	$('#rolesSelectedCount').html(myMessage);
}

function clickAdvancedRulesButton() {
	if (advancedRules) {
		advancedRules = false;
		$('#advancedRulesButtonText').html("Advanced Rules Off");
	} else {
		advancedRules = true;
		$('#advancedRulesButtonText').html("Advanced Rules On");
	}
}

function clickHandicapButtonVillagers() {
	villageHandicap = true;
	witchHandicap = false;
}

function clickHandicapButtonNone() {
	villageHandicap = false;
	witchHandicap = false;
}

function clickHandicapButtonWitches() {
	villageHandicap = false;
	witchHandicap = true;
}

// 최초 게임 세팅
function initGame() {
	highlightRoleIndexList = [];
	highlightTeamIndexList = [];
	var names = [];
	var dealTargetPlayerCount = masterMandatoryRoleList.length + myPriorityRoleList.length;
	for (var i = 0; i < dealTargetPlayerCount; i++) {
		if (prevGame != null && !resetNames && i < prevGame.playerList.length) {
			names.push(prevGame.playerList[i].name);
		} else {
			names.push("Player " + (i+1));
		}
	}
	g = new game();
	g.playerList = [];
	for (var i = 0; i < dealTargetPlayerCount; i++) {
		g.playerList.push(new player(names[i]));
	}
	deal(dealTargetPlayerCount);
}

function resetNamesToDefault() {
	for (var i = 0; i < g.playerList.length; i++) {
		g.playerList[i].name = "Player " + (i+1);
	}
	buildPlayerTable('#playerTableBody');
}

function allowDropName(ev) {
    ev.preventDefault();
}

tempDragIndex = null;
function dragName(ev, startIndex) {
	tempDragIndex = startIndex;
    ev.dataTransfer.setData("text", g.playerList[startIndex].name);
}

function dropName(ev, endIndex) {
    ev.preventDefault();
    if (tempDragIndex != null) {
	    temp = g.playerList[endIndex].name;
	    g.playerList[endIndex].name = g.playerList[tempDragIndex].name;
	    g.playerList[tempDragIndex].name = temp;
    	tempDragIndex = null;
    } else {
    	g.playerList[endIndex].name = ev.dataTransfer.getData("text");
    }
	buildPlayerTable('#playerTableBody');
}

function deal(playerCount) {
	function shuffle(array) {
    var counter = array.length, temp, index;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}
	if (playerCount <  masterMandatoryRoleList.length) {
		return 1;
	} else if (playerCount > masterMandatoryRoleList.length + masterElectiveRoleList.length - masterDisabledRoleList.length) {
		return 2;
	}
	var myRoles = masterMandatoryRoleList.slice(0);
	for (var i = 0; i < myPriorityRoleList.length; i++) {
		var r = myPriorityRoleList[i];
		if (myRoles.indexOf(r) == -1 && masterDisabledRoleList.indexOf(r) == -1) {
			myRoles.push(r);
		}
	}
	for (var i = 0; myRoles.length < playerCount; i++) {
		var r = masterElectiveRoleList[i];
		if (myRoles.indexOf(r) == -1 && masterDisabledRoleList.indexOf(r) == -1) {
			myRoles.push(r);
		}
	}
	shuffle(myRoles);
	var teamCount = playerCount;
	var myTeams = [];
	for (var i = 0; i < myRoles.length; i++) {
		var r = myRoles[i];
		g.playerList[i].role = r;
		if (masterHolyRoleList.indexOf(r) != -1) { //holy character
			g.playerList[i].team = 1;
			teamCount -= 1;
		}
	}
	var witchCount = computeWitchCount(myRoles);
	while(witchCount > 0) {
		myTeams.push(-1);
		witchCount -= 1;
	}
	while (myTeams.length < teamCount) {
		myTeams.push(0);
	}
	shuffle(myTeams);
	for (var i = 0; i < playerCount; i++) {
		if (g.playerList[i].team == null) {
			g.playerList[i].team = myTeams.pop();
		}
	}

	console.log(g.playerList);

	g.aliveNum = playerCount;
	$('#playerListPrompt').html("<p class='modSecret instructions'>Your Village</p>");
	buildPlayerTable('#playerTableBody');
	nameClean();
	updateView();
	return 0;
}

// 셔플
function shuffle(array) {
    var counter = array.length, temp, index;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}

// 플레이어 추가
function addPlayer() {
	if (g.playerList.length >= masterElectiveRoleList.length - masterDisabledRoleList.length) {
		return 1;
	}
	highlightRoleIndexList = [];
	highlightTeamIndexList = [];
	var myRoles = [];
	for (var i = 0; i < g.playerList.length; i++) {
		myRoles.push(g.playerList[i].role);
	}
	var myOldWitchCount = computeWitchCount(myRoles);
	var myRole = null;
	for (var i = 0; i < myPriorityRoleList.length; i++) {
		if (myRoles.indexOf(myPriorityRoleList[i]) == -1) {
			myRole = myPriorityRoleList[i];
			break;
		}
	}
	if (myRole == null) {
		for (var i = 0; i < masterElectiveRoleList.length; i++) {
			if (myRoles.indexOf(masterElectiveRoleList[i]) == -1 && masterDisabledRoleList.indexOf(masterElectiveRoleList[i]) == -1) {
				myRole = masterElectiveRoleList[i];
				break;
			}
		}
	}
	var p = new player("Player " + (g.playerList.length + 1));
	p.role = myRole;
	if (masterHolyRoleList.indexOf(myRole) == -1) {
		p.team = 0;
	} else {
		p.team = 1;
	}
	var targetID = Math.floor(Math.random() * g.playerList.length)
	g.playerList.splice(targetID,0,p);
	highlightRoleIndexList.push(targetID);


	var teamChangeCount = 0;
	//team swap if not holy
	if (masterHolyRoleList.indexOf(myRole) == -1) {
		var nonHolyList = [];
		for (var i = 0; i < g.playerList.length; i++) {
			if (g.playerList[i].team != 1) {
				nonHolyList.push(i);
			}
		}
		shuffle(nonHolyList);
		var targetID2 = nonHolyList.pop();
		if (g.playerList[targetID].team == g.playerList[targetID2].team) {
			highlightTeamIndexList.push(targetID);
		} else {
			var temp = g.playerList[targetID].team;
			g.playerList[targetID].team = g.playerList[targetID2].team;
			g.playerList[targetID2].team = temp;
			highlightTeamIndexList.push(targetID);
			highlightTeamIndexList.push(targetID2);
			teamChangeCount += 2;
		}
	} else {
		highlightTeamIndexList.push(targetID);
	}

	var teamAdditionList = [];
	if (computeWitchCount(myRoles.concat(myRole)) > myOldWitchCount) {
		teamAdditionList = [-1];
	}

	if (teamAdditionList.length) {
		var villagerList = [];
		for (var i = 0; i < g.playerList.length; i++) {
			if (g.playerList[i].team == 0) {
				villagerList.push(i);
			}
		}
		shuffle(villagerList);
		while (teamAdditionList.length && villagerList.length) {
			var myIndex = villagerList.pop();
			g.playerList[myIndex].team = teamAdditionList.pop();
			highlightTeamIndexList.push(myIndex);
			teamChangeCount += 1;
		}
	}
	myMessage = "<p class='modVoice'>Added character " + masterRoleDict[myRole] + " at slot " + (targetID + 1);
	if (teamChangeCount == 0) {
		myMessage += ":</p>";
	} else if (teamChangeCount == 1){
		myMessage += " and changed 1 other team card:</p>";
	} else {
		myMessage += " and changed " + teamChangeCount + " other team cards:</p>";
	}
	$('#playerListPrompt').html(myMessage);
	g.aliveNum += 1;
	nameClean();
	updateView();
	return 0;
}

function subtractPlayer() {
	if (g.playerList.length <= masterMandatoryRoleList.length) {
		return 1;
	}
	highlightRoleIndexList = [];
	highlightTeamIndexList = [];
	var myRoles = [];
	for (var i = 0; i < g.playerList.length; i++) {
		myRoles.push(g.playerList[i].role);
	}
	var myOldWitchCount = computeWitchCount(myRoles);
	var myRole = null;
	for (var i = masterElectiveRoleList.length - 1; i > -1; i--) {
		if (myRoles.indexOf(masterElectiveRoleList[i]) != -1 && myPriorityRoleList.indexOf(masterElectiveRoleList[i]) == -1 && masterMandatoryRoleList.indexOf(masterElectiveRoleList[i]) == -1) {
			myRole = masterElectiveRoleList[i];
			break;
		}
	}
	if (myRole == null) {
		for (var i = myPriorityRoleList.length - 1; i > -1; i--) {
			if (myRoles.indexOf(myPriorityRoleList[i]) != -1) {
				myRole = myPriorityRoleList[i];
				break;
			}
		}
	}

	var targetID;
	var looseTeam;
	for (var i = 0; i < g.playerList.length; i++) {
		if (g.playerList[i].role == myRole) {
			targetID = i;
			looseTeam = g.playerList[i].team;
			break;
		}
	}
	g.playerList.splice(targetID,1);

	var teamChangeCount = 0;
	var teamRemovalList = [];
	if (masterHolyRoleList.indexOf(myRole) != -1) {
		teamRemovalList.push(1);
	}
	myRoles.splice(myRoles.indexOf(myRole),1);
	var myNewWitchCount = computeWitchCount(myRoles);
	if (myNewWitchCount < myOldWitchCount) {
		teamRemovalList.push(-1);
	}
	if (teamRemovalList.indexOf(looseTeam) != -1) {
		teamRemovalList.splice(teamRemovalList.indexOf(looseTeam),1);
		looseTeam = null;
	}
	for (var i = 0; i < teamRemovalList.length; i++) {
		var teamList = [];
		for (var j = 0; j < g.playerList.length; j++) {
			if (g.playerList[j].team == teamRemovalList[i]) {
				teamList.push(j);
			}
		}
		shuffle(teamList);
		var myIndex = teamList.pop();
		g.playerList[myIndex].team = 0;
		highlightTeamIndexList.push(myIndex);
		teamChangeCount += 1;
	}
	if (looseTeam != null && looseTeam != 0) {
		var villagerList = [];
		for (var i = 0; i < g.playerList.length; i++) {
			if (g.playerList[i].team == 0) {
				villagerList.push(i);
			}
		}
		shuffle(villagerList);
		var myIndex = villagerList.pop();
		g.playerList[myIndex].team = looseTeam;
		highlightTeamIndexList.push(myIndex);
		teamChangeCount += 1;
	}
	myMessage = "<p class='modVoice'>Removed character " + masterRoleDict[myRole] + " at slot " + (targetID + 1);
	if (teamChangeCount == 0) {
		myMessage += ":</p>";
	} else if (teamChangeCount == 1){
		myMessage += " and changed 1 other team card:</p>";
	} else {
		myMessage += " and changed " + teamChangeCount + " other team cards:</p>";
	}
	$('#playerListPrompt').html(myMessage);
	g.aliveNum -= 1;
	nameClean();
	updateView();
	return 0;
}

function nameClean() {
	for (var i = 0; i < g.playerList.length; i++) {
		if (g.playerList[i].name == null || (g.playerList[i].name.length > 6 && g.playerList[i].name.slice(0,6) == "Player")) {
			g.playerList[i].name = "Player " + (i + 1);
		}
	}
}

function toggleHideRoles() {
	document.activeElement.blur()
	g.hideRoles = !g.hideRoles;
	$('.reveal-roles-icon').toggleClass("glyphicon-eye-open glyphicon-eye-close");
	buildPlayerTable('#playerTableBody');
}

function renameStart(playerNum) {
	$(".player-name-input").off();
	if (currentRename == playerNum) {
		return;
	} else if (currentRename != null) {
		$("#name" + currentRename).show();
		$("#nameInput" + currentRename).hide();
		$("#rename" + currentRename).prop('disabled', false);
	}
	currentRename = playerNum;
	nextRename = null;
	$("#name" + currentRename).hide();
	var myInput = $("#nameInput" + currentRename).show().focus()[0];
	myInput.setSelectionRange(0, myInput.value.length);
	$("#nameInput" + currentRename).keypress(function(event) {
		if (event.which == 13) {
			if (playerNum + 1 < g.playerList.length) {
				nextRename = (playerNum + 1);
			}
			$("#nameInput" + currentRename).blur();
		}
	});
	$("#rename" + currentRename).prop('disabled', true);
}

function renamePlayer() {
	if (currentRename == null) {
		return 1;
	}
	newName = $('#nameInput'+ currentRename)[0].value.trim();
	if (newName == null || newName == "") {
		$("#nameInput" + currentRename).attr("value", $("#name" + currentRename).html());
	} else {
		if (newName.length > PLAYER_NAME_MAX_LENGTH) {
			newName = newName.slice(0,PLAYER_NAME_MAX_LENGTH);
		}
		g.playerList[currentRename].name = newName;
		$("#name" + currentRename).html(newName);
	}
	$("#name" + currentRename).show();
	$("#nameInput" + currentRename).hide();
	$("#rename" + currentRename).prop('disabled', false);
	if (nextRename != null) {
		renameStart(nextRename);
	} else {
		currentRename = null;
	}
}

function buildPlayerTable(target) {
	if (g.currentPhase == "Deal") {
		$('#resetNamesButton').show();
	} else {
		$('#resetNamesButton').hide();
	}
	var covenCount = 0;
	var firstCovenID = null;
	for (var i = 0; i < g.playerList.length; i++) {
		if ((g.playerList[i].covenJoinCycleNum != null) && (g.playerList[i].deathCycleNum == null)) {
			covenCount += 1;
			if (firstCovenID == null) {
				firstCovenID = i;
			}
		}
	}
	var myTable = "";
	for (var i = 0; i < g.playerList.length; i++) {
		p = g.playerList[i];
		myTable += "<tr id='player" + i + "' class='player-list-row";
		if (i % 2) {
			myTable += " custom-stripe-row";
		}
		if (g.stepList.length > 0 && g.stepList[0] == "spiritualist") {
			if (p.deathCycleNum == null) {
				myTable += " dead-player-row";
			}
		} else {
			if (p.deathCycleNum != null) {
				myTable += " dead-player-row";
			}
		}
		myTable += "'>";

		/*
		myTable += "<td class='col-lg-1 col-md-1 col-sm-1 col-xs-1'>";
		myTable += "<button id='rename" + i + "' class='btn' onClick='renameStart(" + i + ")'>";
		myTable += "<span class='glyphicon glyphicon-edit'></span></button>";
		myTable += "</td>";
		*/

		myTable += "<td class='col-lg-7 col-md-7 col-sm-7 col-xs-7 player-name'>";
		myTable += "<p id='name" + i + "' class='player-name' onClick='renameStart(" + i + ")' on ";
		myTable += "draggable='true' ondragstart='dragName(event," + i + ")' ondragover='allowDropName(event," + i + ")' ondrop='dropName(event," + i + ")'";
		myTable += ">" + p.name + "</p>";
		myTable += "<input id='nameInput" + i + "' type='text' value='" + p.name + "' class='player-name player-name-input' onBlur='renamePlayer()' ";
		myTable += "draggable='true' ondragstart='dragName(event," + i + ")' ondragover='allowDropName(event," + i + ")' ondrop='dropName(event," + i + ")'";
		myTable += "></input>";
		myTable += "</td>";

		myTable += "<td class='col-lg-1 col-md-1 col-sm-1 col-xs-1 icon-tag'>";
		if (i == g.bombHolder) {
			myTable += "<span class='glyphicon glyphicon-certificate'></span>";
		}
		if (p.deathCycleNum != null) {
			myTable += "<span class='glyphicon glyphicon-remove'></span>";
		} else {
			if (p.isBanned) {
				myTable += "<span class='glyphicon glyphicon-warning-sign'></span>";
			}
			if (!g.hideRoles || target == "#winPlayerTableBody") {
				if (g.nightKillList.indexOf(i) != -1) {
					myTable += "<span class='glyphicon glyphicon-screenshot'></span>";
				}
				if (g.covenIllusion && i == firstCovenID) {
					myTable += "<span class='glyphicon glyphicon-gift'></span>";
				}
				if (g.angelProtectList.indexOf(i) != -1) {
					if (p.protectionInvalid) {
						myTable += "<span class='glyphicon glyphicon-star-empty'></span>";
					} else {
						myTable += "<span class='glyphicon glyphicon-star'></span>";
					}
				} else if (p.protectionInvalid) {
					myTable += "<span class='glyphicon glyphicon-ban-circle'></span>";
				} else if (g.hauntingTargetList.indexOf(i) != -1) {
					myTable += "<span class='glyphicon glyphicon-transfer'></span>";
				}
				for (var j = 0; j < p.extraLives; j++) {
					myTable += "<span class='glyphicon glyphicon-heart'></span>";
				}
				if (covenCount == 1 && p.team < 0 && p.deathCycleNum == null) {
					myTable += "<span class='glyphicon glyphicon-fire'></span>";
				}
			}
		}
		myTable += "</td>";


		// 팀 선택
		myTable += "<td class='col-lg-1 col-md-1 col-sm-1 col-xs-1 ";
		if (highlightTeamIndexList.indexOf(i) != -1) {
			myTable += "highlight-role-tag";
		}
		if (g.hideRoles && target != '#winPlayerTableBody') {
			myTable += " role-mystery'>?";
		} else {
			myTable += " role-tag' onclick=teamSelect("+i+")>" + abbrevTeamDict[p.team];
		}
		myTable += "</td>";

		myTable += "<td class='col-lg-1 col-md-1 col-sm-1 col-xs-1 ";
		if (highlightRoleIndexList.indexOf(i) != -1) {
			myTable += "highlight-role-tag";
		}
		if (g.hideRoles && target != '#winPlayerTableBody') {
			myTable += " role-mystery'>?";
		} else {
			myTable += " role-tag' onclick=roleSelect("+i+")>" + abbrevRoleDict[p.role];
		}
		myTable += "</td>";

		myTable += "<td class='col-lg-1 col-md-1 col-sm-1 col-xs-1'>";
		myTable += "<button id='select" + i + "' class='btn";
		if (g.legalInputList.indexOf(i) == -1) {
			myTable += " disabled'>";
		} else {
			myTable += "' onClick='stepSubmit(" + i + ", false)'>";
		}
		myTable += "<span class='glyphicon glyphicon-hand-left'>";
		myTable += "</span></button></td></tr>";
	}
    $(target).html(myTable);
	$(".player-name-input").hide();
}

// 팀 변경
function teamSelect(i) {
	notUndoflag = true;
	$('.undo-button').addClass("disabled");
	$('#playerList').hide();
	$('#teamSelect').show();
	$('#teamSelectTb').show();
	playerIndex = i;
	console.log("--전체 인원 : "+ masterMandatoryRoleList.length);
	console.log(g.playerList);
	console.log("--마녀 인원 : "+ computeWitchCount(masterMandatoryRoleList))
	console.log(g);
}

// 캐릭터 변경
function roleSelect(i) {
	notUndoflag = true;
	$('.undo-button').addClass("disabled");
	$('#playerList').hide();
	$('#roleSelect').show();
	$('#roleSelectTb').show();
	playerIndex = i;
}

function teamChange(alt) {
	g.playerList[playerIndex].team = parseInt(alt);

	var excImg = $('#playerTableBody').find('tr').eq(playerIndex).find('td').eq(2);
	var newTeamImage = "img/teamicons/teamicon_" + imgTeamDict[alt] + ".png"
	excImg.find('img').attr('src', newTeamImage)
	
	$('#teamSelect').hide();
	$('#teamSelectTb').hide();
	$('#playerList').show();
	console.log(g.playerList);

	console.log("전체 인원 : "+ masterMandatoryRoleList.length);
	console.log("마녀 인원 : "+ computeWitchCount(masterMandatoryRoleList))
}

function roleChange(alt) {
	g.playerList[playerIndex].role = parseInt(alt);
	
	if(checkDuplicateRoles(g.playerList) === true){
		var excImg = $('#playerTableBody').find('tr').eq(playerIndex).find('td').eq(3);
		var newRoleImage = "img/roleicons/roleicon_" + imgRoleDict[alt] + ".jpg"
		excImg.find('img').attr('src', newRoleImage)
		if(alt == 0 || alt == 16){
			var clergyImageSource = "img/teamicons/teamicon_clergy.png"
			$('#playerTableBody').find('tr').eq(playerIndex).find('td').eq(2).find('img').attr('src', clergyImageSource);
			g.playerList[playerIndex].team = parseInt(1);
		}
		
		$('#roleSelect').hide();
		$('#roleSelectTb').hide();
		$('#playerList').show();

		console.log(g.playerList);
	}	
}

function cancelChange(selectTp) {
	if(selectTp == 0){
		$('#teamSelect').hide();
		$('#teamSelectTb').hide();
		$('#playerList').show();
	}else{
		$('#roleSelect').hide();
		$('#roleSelectTb').hide();
		$('#playerList').show();
	}
}

// 중복된 'role' 값을 검사하는 함수
function checkDuplicateRoles(arr) {
	var roleSet = new Set(); // 중복 체크를 위한 Set 객체
  
	for (var i = 0; i < arr.length; i++) {
	  var currentRole = arr[i].role;
  
	  // 이미 Set에 존재하는 역할이라면 중복이므로 에러 출력
	  if (roleSet.has(currentRole)) {
		console.error('에러: 중복된 role 값이 발견되었습니다 -', currentRole);
		alert('이미 선택된 캐릭터가 있습니다.', currentRole);
		return false;
	  }
  
	  // Set에 현재 역할 추가
	  roleSet.add(currentRole);
	}
  
	console.log('모든 role 값이 유일합니다.')
	return true;
}  
  
function timerReset() {
	g.pausedTimeLeft = g.currentStepLength;
	g.targetTime = null;
	$('#play').addClass("glyphicon-play");
	$('#play').removeClass("glyphicon-pause");
	var now = new Date();
	now.setSeconds(now.getSeconds() + g.pausedTimeLeft);
	$('#timer').countdown("destroy");
	$('#timer').countdown({until: now,
						   layout: '{mn}{sep}{snn}'});
	$('#timer').countdown("pause");
}

function timerPause() {
	$('#timer').countdown('pause');
	g.pausedTimeLeft = $.countdown.periodsToSeconds($('#timer').countdown('getTimes'));
	g.targetTime = null;
	$('#play').addClass("glyphicon-play");
	$('#play').removeClass("glyphicon-pause");
}

function timerResume() {
	if (g.pausedTimeLeft == null) {
		g.pausedTimeLeft = g.currentStepLength;
	}
	g.targetTime = new Date();
	g.targetTime.setSeconds(g.targetTime.getSeconds() + g.pausedTimeLeft);
	g.pausedTimeLeft = null;
	$('#play').removeClass("glyphicon-play");
	$('#play').addClass("glyphicon-pause");
	$('#timer').countdown('destroy');
	$('#timer').countdown({until: g.targetTime,
	                       layout: '{mn}{sep}{snn}'});
}

function timerAdd(seconds) {
	var wasPaused = (g.pausedTimeLeft != null);
	if (!wasPaused) {
		timerPause();
	}
	g.pausedTimeLeft += seconds;
	if (g.pausedTimeLeft > (10*60-1)) {
		g.pausedTimeLeft = 10*60 - 1;
	}
	if (!wasPaused) {
		timerResume();
	} else {
		var now = new Date();
		now.setSeconds(now.getSeconds() + g.pausedTimeLeft);
		$('#timer').countdown('destroy');
		$('#timer').countdown({until: now,
							   layout: '{mn}{sep}{snn}'});
		$('#timer').countdown('pause');
	}
}

function timerSubtract(x) {
	timerAdd(-x);
}

function timerButtonReset() {
	timerReset();
}

function timerButtonBack() {
	timerAdd(TIMER_SKIP);
}

function timerButtonPlay() {
	if (g.pausedTimeLeft == null) {
		timerPause();
	} else {
		timerResume();
	}
}

function timerButtonForward() {
	timerSubtract(TIMER_SKIP);
}

function kill(playerNum) {
	p = g.playerList[playerNum];
	p.extraLives = 0;
	p.deathCyclePhase = g.currentPhase;
	p.deathCycleNum = g.cycleNum;
	p.protectionInvalid = false;
	if (g.currentPhase == "Day") {
		g.gravediggerTrigger = true;
	}
}

function onDeath(playerNum) {
	//this is responsible for adding STEP_BOD and STEP_DOB
	//STEP_DOB should always be placed AFTER STEP_BOD, and check for it
	p = g.playerList[playerNum];
	if (!p.isBanned)
	{
		if (p.role == 17) {
			for (var i = 0; i < g.playerList.length; i++) {
				if (g.playerList[i].team < 0 && g.playerList[i].deathCycleNum == null) { //only do BOD if there are witches left in the game
					var currentStep = g.stepList.shift();
					g.stepList.unshift(currentStep, "BOD");
					break;
				}
			}
		}
		if (p.role == 5) { // Do DOB no matter what, and do it first
			var currentStep = g.stepList.shift();
			if (g.stepList.length > 0 && g.stepList == "BOD") {
				g.stepList.shift();
				g.stepList.unshift(currentStep, "BOD", "DOB");
			} else {
				g.stepList.unshift(currentStep, "DOB");
			}
		}
	}
	if (p.role == 11) {
		g.peepingTomAvailable = null;
	}
	g.aliveNum -= 1;
	logPlayer(playerNum, 1);
}

function onSurvival(playerNum) {
	//this is responsible for setting g.hunterNight
	var hunterInGame = false;
	for (var i = 0; i < g.playerList.length; i++) {
		if (g.playerList[i].role == 10) {
			hunterInGame = true;
			break;
		}
	}
	logPlayer(playerNum, 0);
	if (hunterInGame && g.hunterNight == null) {
		g.hunterNight = g.cycleNum;
		return "<br><p class='modVoice'>Because this is the first time someone has survived, the Hunter may kill a target tonight.</p>";
	}
	return "";
}

function modkill(playerNum, isBanned) {
	kill(playerNum);
	if (isBanned) {
		g.playerList[playerNum].isBanned = true;
	}
	onDeath(playerNum);
}

function step() {
	if (g.peepingTomTrigger) {
		g.peepingTomTrigger = false;
		g.peepingTomActive = g.peepingTomAvailable;
		g.peepingTomAvailable = null;
	} else {
		g.peepingTomActive = null;
	}
	g.stepCompleted = false;
	if (g.stepList.length) {
		g.stepList.shift(); //advance
	}
	if (g.stepList.length == 0) {
		if (g.currentPhase == "Deal") {
			g.currentPhase = "Game Start";
			highlightRoleIndexList = [];
			highlightTeamIndexList = [];
		} else if (g.currentPhase == "Day") {
			g.currentPhase = "Night";
		} else if ((g.currentPhase == "Game Start") || (g.currentPhase == "Night")){
			g.currentPhase = "Day";
		} else {
		}
		g.legalTargetList = [];
		g.stepList = STEP_dict[g.currentPhase].slice(0);
	}

	nextStep = eval("STEP_" + g.stepList[0]);
	if (nextStep.hasOwnProperty("team_requirement")) {
		var foundTeam = false;
		for (var i = 0; i < g.playerList.length; i++) {
			if (g.playerList[i].team == nextStep.team_requirement) {
				foundTeam = true;
				break;
			}
		}
		if (!foundTeam) {
			return step();
		}
	} else if (nextStep.hasOwnProperty("role_requirement")) {
		var foundRole = false;
		for (var i = 0; i < g.playerList.length; i++) {
			if (g.playerList[i].role == nextStep.role_requirement) {
				foundRole = true;
				break;
			}
		}
		if (!foundRole) {
			return step();
		}
	}

	g.deadRole = false; //only used for role, not team
	g.bannedRole = false; //only used for role, not team
	g.linkList = [];
	if (nextStep.hasOwnProperty("team_link")) {
		for (var i = 0; i < g.playerList.length; i++) {
			if (g.playerList[i].team == nextStep.team_link) {
				g.linkList.push(i);
			}
		}
	} else if (nextStep.hasOwnProperty("role_link")) {
		for (var i = 0; i < g.playerList.length; i++) {
			if (g.playerList[i].role == nextStep.role_link) {
				g.linkList.push(i);
				if (g.playerList[i].deathCycleNum != null) {
					g.deadRole = true;
				} else if (g.playerList[i].isBanned) {
					g.bannedRole = true;
				}
				break;
			}
		}
	}

	if (nextStep.hasOwnProperty("timer")) {
		g.currentStepLength = nextStep.timer;
	} else {
		g.currentStepLength = null;
	}
	g.targetTime = null;
	g.pausedTimeLeft = null;

	g.interruptStepList = [];
	if (nextStep.hasOwnProperty("interrupt_list")) {
		for (var i = 0; i < nextStep.interrupt_list.length; i++) {
			iStep = eval("STEP_" + nextStep.interrupt_list[i]);
			if (iStep.hasOwnProperty("team_requirement")) {
				var foundTeam = false;
				for (var j = 0; j < g.playerList.length; j++) {
					if (g.playerList[j].team == iStep.team_requirement && g.playerList[j].deathCycleNum == null) {
						foundTeam = true;
						break;
					}
				}
				if (foundTeam) {
					g.interruptStepList.push(nextStep.interrupt_list[i]);
				}
			} else if (iStep.hasOwnProperty("role_requirement")) {
				var foundRole = false;
				for (var j = 0; j < g.playerList.length; j++) {
					if (g.playerList[j].role == iStep.role_requirement && g.playerList[j].deathCycleNum == null && g.playerList[j].used == false) {
						foundRole = true;
						break;
					}
				}
				if (foundRole) {
					if (iStep.hasOwnProperty("requires_dead_players")) {
						var foundDead = false;
						for (var j = 0; j < g.playerList.length; j++) {
							if (g.playerList[j].deathCycleNum != null) {
								foundDead = true;
								break;
							}
						}
						if (foundDead) {
							g.interruptStepList.push(nextStep.interrupt_list[i]);
						}
					}
					else {
						g.interruptStepList.push(nextStep.interrupt_list[i]);
					}
				}
			} else {
				g.interruptStepList.push(nextStep.interrupt_list[i]);
			}
		}
		if (g.interruptPausedTimeLeft != null) {
			g.pausedTimeLeft = g.interruptPausedTimeLeft;
			g.interruptPausedTimeLeft = null;
		}
	} else if (nextStep.hasOwnProperty("interrupt") != true) {
		g.interruptPausedTimeLeft = null;
	}
	if (nextStep.hasOwnProperty("no_target_invalid")) {
		g.legalInputList = [];
	} else {
		g.legalInputList = [77];
	}

	switch(nextStep.prompt_type) {
		case "target":
			//no break
		case "target-auto":
			var angelCount = 0;
			var demonCount = 0;
			for (var i = 0; i < g.playerList.length; i++) {
				if (g.playerList[i].deathCycleNum != null && !g.playerList[i].isBanned) {
					if (g.playerList[i].team < 0) {
						demonCount++;
					} else {
						angelCount++;
					}
				}
			}
			if ((!g.deadRole && !g.bannedRole) || nextStep.hasOwnProperty('death_exception') || g.peepingTomActive) {
				for (var i = 0; i < g.playerList.length; i++) {
					var p = g.playerList[i];
					if (nextStep.hasOwnProperty('target_restrictions')) {
						switch (nextStep.target_restrictions) {
							case "angels":
								if (angelCount == 0)
								{
									if (demonCount == 0) {
										step();
										return;
									}
								} else if (p.protectionInvalid) {
									//invalid protection target -- already protected while haunted
								} else if (advancedRules && angelCount <= demonCount) {
									//invalid protection target -- angels don't outnumber demons
								} else if (p.deathCycleNum == null) {
									g.legalInputList.push(i);
								}
								break;
							case "demons":
								if (demonCount == 0)
								{
									if (angelCount == 0 || nextStep.prompt_type == "target")
									{
										step();
										return;
									}
								} else if (g.hauntingTargetList.indexOf(77) != -1) {
									//no one selected for initial meddle
								} else if (g.hauntingTargetList.indexOf(i) != -1) {
									//invalid shenanigans target -- targets must be different
								} else if (p.deathCycleNum == null) {
									g.legalInputList.push(i);
								}
								break;
							case "last stand":
								if (g.nightKillList.indexOf(i) != -1) {
									//invalid last stand target -- targets must be different
								} else if (p.deathCycleNum == null) {
									g.legalInputList.push(i);
								}
							default: //default is none, should never be used
								break;
						}
					} else if (p.deathCycleNum == null) {	//"only living targets" is the default
						g.legalInputList.push(i);
					}
				}
			}
			break;
		case "target-dead-only":
			for (var i = 0; i < g.playerList.length; i++) {
				if (g.playerList[i].deathCycleNum != null) {
					g.legalInputList.push(i);
				}
			}
			break;
		case "target-all":
			for (var i = 0; i < g.playerList.length; i++) {
				g.legalInputList.push(i);
			}
			break;
		case "choice":
			//no break
		case "choice-auto":
			if ((!g.deadRole && !g.bannedRole) || g.peepingTomActive) {
				for (var i = 0; i < nextStep.prompt_choices.length; i++) {
					if (nextStep.hasOwnProperty("prompt_choices_illegal")) {
						if (nextStep.prompt_choices_illegal.indexOf(nextStep.prompt_choices[i]) == -1) {
							g.legalInputList.push(i);
						}
					} else {
						g.legalInputList.push(i);
					}
				}
			}
			break;
		case "role":
			for (var i = 0; i < g.playerList.length; i++) {
				g.legalInputList.push(g.playerList[i].role);
			}
			g.legalInputList.sort();
			break;
		case "info":
			var angelCount = 0;
			var demonCount = 0;
			for (var i = 0; i < g.playerList.length; i++) {
				if (g.playerList[i].deathCycleNum != null && !g.playerList[i].isBanned) {
					if (g.playerList[i].team < 0) {
						demonCount++;
					} else {
						angelCount++;
					}
				}
			}
			if (nextStep.prompt_subject == "Angels" && angelCount == 0 && demonCount == 0)
			{
				step();
				return;
			}
			//nextStep(); -- we now do this in update view; all step methods flagged as info MUST not mutate the game state!
			break;
		case "win" :
			g.log += "-";
			for (var i = 0; i < g.logData.length; i++) {
				g.log += g.logData[i];
			}
			g.log += g.cycleNum;
			var myNormalRolesList = [];
			var myExtraRolesList = [];
			var myMissingRolesList = [];
			for (var i = 0; i < g.playerList.length; i++) {
				if (g.playerList[i].role > 11) {
					myExtraRolesList.push(i);
				} else {
					myNormalRolesList.push(i);
				}
			}
			for (var i = 0; i < 12; i++) {
				if (myNormalRolesList.indexOf(i) == -1) {
					myMissingRolesList.push(i);
				}
			}
			if (myExtraRolesList.length) {
				myExtraRolesList.sort();
				g.log += "-";
				for (var i = 0; i < myExtraRolesList.length; i++) {
					logRole(myExtraRolesList[i],1);
				}
			}
			if (myMissingRolesList.length) {
				myMissingRolesList.sort();
				g.log += "-";
				for (var i = 0; i < myMissingRolesList.length; i++) {
					logRole(myMissingRolesList[i],1);
				}
			}
			nextStep();
			break;
		case "auto":
			nextStep();
			step();
			return 0;
		default:
			break;
	}
	saveGame();
	updateView();
}

function stepSubmit(data, confirmed) {
	if (!g.stepList) {
		return 1;
	}
	nextStep = eval("STEP_" + g.stepList[0]);
	if ((nextStep.prompt_type != "target") && (nextStep.prompt_type != "target-auto") &&
		(nextStep.prompt_type != "target-dead-only") && (nextStep.prompt_type != "target-all") &&
		(nextStep.prompt_type != "choice") && (nextStep.prompt_type != "choice-auto") &&
		(nextStep.prompt_type != "role")) {
		return 2;
	}
	if (!confirmed && autoSteps == null) {
		if (confirmTarget && (nextStep.prompt_type == "target" || nextStep.prompt_type == "target-dead-only" || nextStep.prompt_type == "target-all")) {
			if (data == 77) {
				confirmModal($('#noLynchButton').html(), data);
			} else {
				confirmModal(g.playerList[data].name, data);
			}
			return 0;
		} else if (confirmChoice && nextStep.prompt_type == "choice") { //do NOT check choice-auto!
			if (data == 77) {
				confirmModal($('#choice77').html(), data);
			} else {
				confirmModal(nextStep.prompt_choices[data], data);
			}
			return 0;
		} else if (confirmRole && nextStep.prompt_type == "role") {
			confirmModal(masterRoleDict[data], data);
			return 0;
		}
	}
	$('#confirmModal').modal('hide');

	result = nextStep(data);

	if (result != 0) {
		//invalid input, program state has not advanced, do nothing
		//TODO: responsible for presenting error pop up modal
	} else {
		if (nextStep.prompt_type == "choice-auto" || nextStep.prompt_type == "target-auto") {
			step();
			return 0;
		} else {
			g.prevTarget = data;
			g.stepCompleted = true;
			$('.main-section').hide();
			$('#info').show();
			if (nextStep.hasOwnProperty("timer_alt")) {
				g.currentStepLength = nextStep.timer_alt;
			} else if (nextStep.hasOwnProperty("timer")) {
				g.currentStepLength = nextStep.timer;
			} else {
				g.currentStepLength = null;
			}
			g.targetTime = null;
			g.pausedTimeLeft = null;
			if (gameStack.length < 2 || !JSON.parse(gameStack[gameStack.length - 1]).stepCompleted) {
				saveGame(); //only save if not already on undo stack to prevent undo fighting
			}
			updateView();
			return 0;
		}
	}
}

function interruptStep(interruptStepIndex) {
	g.stepList.shift();
	g.stepList.unshift("dummy", g.interruptStepList[interruptStepIndex]);
	timerPause();
	g.interruptPausedTimeLeft = g.pausedTimeLeft;
	return step();
}

function updateView() {
	$('.main-section').hide();
	if (g == null) {
		$('.control-button-timer').addClass("disabled");
		$('.reveal-roles-button').addClass("disabled");
		$('.undo-button').addClass("disabled");
		var myHTML = "";
		for (var i = 0; i < masterElectiveRoleList.length; i++) {
			var r = masterElectiveRoleList[i];
			var locked = false;
			myHTML += "<label class='btn btn-role";
			if (masterMandatoryRoleList.indexOf(r) != -1) {
				myHTML += " active";
				myHTML += " disabled";
				locked = true;
			} else if (masterDisabledRoleList.indexOf(r) != -1) {
				myHTML += " disabled";
			} else if (myPriorityRoleList.indexOf(r) != -1) {
				myHTML += " active";
			}
			if (masterHolyRoleList.indexOf(r) != -1) {
				myHTML += " holy-character-button";
			}
			myHTML += "'><input type='checkbox'";
			if (masterMandatoryRoleList.indexOf(r) != -1 || myPriorityRoleList.indexOf(r) != -1) {
				myHTML += " checked";
			}
			if (masterMandatoryRoleList.indexOf(r) == -1 || masterDisabledRoleList.indexOf(r) == -1) {
				myHTML += " onChange='clickRoleButton(" + r + ")'";
			}
			myHTML += ">" + masterRoleDict[r];
			if (locked) {
				myHTML += " <span class='glyphicon glyphicon-lock'></span>";
			}
			myHTML += "</label>";
		}
		$('#roleButtons').html(myHTML);
		refreshRolesSelectedCountMessage();
		$('#body').attr("class","gs");
		$('#gameSettings').show();
		return;
	}
	$('#body').attr('class',phaseStyleDict[g.currentPhase]);
	$('.reveal-roles-button').removeClass("disabled");

	nextStep = eval("STEP_" + g.stepList[0]);

	var newTitle;
	if (nextStep.prompt_subject != null) {
		newTitle = nextStep.prompt_subject;
	} else if (g.linkList.length) {
		newTitle = masterRoleDict[g.playerList[g.linkList[0]].role];
	} else {
		newTitle = "WitchHunt";
	}
	if (g.linkList) {
		if (g.linkList.length == 1) {
			newTitle += " <span class='player-name-highlight'><br>(" + g.playerList[g.linkList[0]].name + ")</span>";
		}
	}
	$('#headerLabel').html(newTitle);

	if (g.currentStepLength == null) {
		$('.control-button-timer').addClass("disabled");
		var now = new Date();
		$('#timer').countdown("destroy");
		$('#timer').countdown({until: now,
							   layout: '{mn}{sep}{snn}'});
		$('#timer').countdown("pause");
	} else if (g.pausedTimeLeft != null) {
		$('.control-button-timer').removeClass("disabled");
		var now = new Date();
		now.setSeconds(now.getSeconds() + g.pausedTimeLeft);
		$('#timer').countdown("destroy");
		$('#timer').countdown({until: now,
							   layout: '{mn}{sep}{snn}'});
		$('#timer').countdown("pause");
	} else {
		$('.control-button-timer').removeClass("disabled");
		timerResume();
	}

	if (nextStep.hasOwnProperty("no_target_invalid")) {
		$(".no-choice-button").hide();
	} else {
		$(".no-choice-button").show();
	}

	var viewType = nextStep.prompt_type;
	if (viewType == "info") {
		nextStep();
	} else if (g.stepCompleted) {
		viewType = "info";
	}

	if (gameStack.length >= 2) {
		$('.undo-button').removeClass("disabled");
	} else {
		$('.undo-button').addClass("disabled");
	}
	$('.reveal-roles-button').addClass("disabled");
	$('.settings-button').addClass("disabled");

	if (g.interruptStepList != null) {
		var myHTML = "";
		for (var i = 0; i < g.interruptStepList.length; i++) {
			iStep = eval("STEP_" + g.interruptStepList[i]);
			myHTML += "<button class='btn no-choice-button' onClick='interruptStep(" + i + ")'>";
			if (g.interruptStepList[i] == "modkillChoice") {
				myHTML += "Modkill";
			} else {
				myHTML += masterRoleDict[iStep.role_link];
			}
			myHTML += "</button>";
		}
		$('#interruptButtons').html(myHTML);
		$('#interruptButtons').show();
	} else {
		$('#interruptButtons').hide();
	}

	var angelCount = 0;
	var demonCount = 0;
	for (var i = 0; i < g.playerList.length; i++) {
		if (g.playerList[i].deathCycleNum != null && !g.playerList[i].isBanned) {
			if (g.playerList[i].team < 0) {
				demonCount++;
			} else {
				angelCount++;
			}
		}
	}

	switch (viewType) {
		case "deal":
			$('.undo-button').removeClass("disabled");
			$('.reveal-roles-button').removeClass("disabled");
			$('#playerListPrompt2').hide();
			buildPlayerTable('#playerTableBody');
			$('#redealButtons').show();
			$('#gameStartButtons').show();
			if (!DEBUG) {
				$('#debugButtons').hide();
			}
			$('#playerListButtons').hide();
			$('#playerList').show();
			break;
		case "target":
			//break
		case "target-dead-only":
			//break
		case "target-auto":
			//break
		case "target-all":
			$('.reveal-roles-button').removeClass("disabled");
			if (nextStep.prompt_string == "LYNCH") {
				g.hauntingTargetList = [];
				var s = "<p class='modVoice'>It is now <b>Day " + g.cycleNum + "</b>.<br>";
				s += "There are <b>" + g.aliveNum + "</b> players alive, so it requires <b>";
				s += (Math.floor((g.aliveNum)/2) +1 ) + "</b> to lynch.</p>";
				$('#playerListPrompt').html(s);
			} else {
				$('#playerListPrompt').html(nextStep.prompt_string);
			}
			if (nextStep.hasOwnProperty("no_target_string")) {
				$('#noLynchButton').html(nextStep.no_target_string);
			} else {
				$('#noLynchButton').html("No One");
			}
			buildPlayerTable('#playerTableBody');
			$('#redealButtons').hide();
			$('#gameStartButtons').hide();
			$('#debugButtons').hide();
			$('#playerListButtons').show();
			if (g.legalInputList.indexOf(77) == -1) {
				$('#noLynchButton').hide();
			} else {
				$('#noLynchButton').show();
			}
			if (g.legalInputList.length == 1 && g.legalInputList[0] == 77) {
				var s = "<p class='modSecret'>(";
				if (g.deadRole) {
					s += pn(g.linkList[0]) + " the ";
					s += masterRoleDict[g.playerList[g.linkList[0]].role] + " is dead."
				} else if (g.bannedRole) {
					s += pn(g.linkList[0]) + " the ";
					s += masterRoleDict[g.playerList[g.linkList[0]].role] + " was removed from the game and is a cursed totem."
				} else if (nextStep.target_restrictions == "demons") {
					if (demonCount == 0) {
						s += "There are no Demons yet.";
					} else {
						s += "Meddling with no one."
					}
				} else if (nextStep.target_restrictions == "angels") {
					if (angelCount == 0) {
						s += "There are no Angels yet.";
					} else if (advancedRules && angelCount <= demonCount) {
						s += "The Angels cannot protect until they outnumber the Demons.";
					} else {
						s += "There are no valid targets left to protect!";
					}
				}
				s += ")</p>";
				$('#playerListPrompt2').html(s);
				$('#playerTable').hide();
				$('#playerListPrompt2').show();
				$('#playerListButtons').addClass("bottom-floor advance-button-group");
			} else {
				$('#playerTable').show();
				$('#playerListPrompt2').hide();
				$('#playerListButtons').removeClass("bottom-floor advance-button-group");
			}
			$('#playerList').show();
			if (nextStep.hasOwnProperty("no_target_string_override")) {
				$('#noLynchButton').html(nextStep.no_target_string_override);
			} else {
				$('#noLynchButton').html("No One");
			}
			break;
		case "choice":
			//no break
		case "choice-auto":
			$('#choicePrompt').html(nextStep.prompt_string);
			$('.choice-button').hide();
			for (var i = 0; i < g.legalInputList.length; i++) {
				if (g.legalInputList[i] != 77) {
					$('#choice' + g.legalInputList[i]).html(nextStep.prompt_choices[g.legalInputList[i]]);
				}
				$('#choice' + g.legalInputList[i]).show();
			}
			if (nextStep.hasOwnProperty("no_target_string_override")) {
				$('#choice77').html(nextStep.no_target_string_override);
			} else {
				$('#choice77').html("None");
			}
			$('#choice').show();
			break;
		case "role":
			$('#roleListPrompt').html(nextStep.prompt_string);
			var myRoleList = [];
			for (var i = 0; i < g.playerList.length; i++) {
				myRoleList.push(g.playerList[i].role);
			}
			myRoleList.sort();
			var myTable = "";
			for (var i = 0; i < myRoleList.length; i++) {
				myTable += "<tr id='role" + myRoleList[i] + "' class='player-list-row";
				if (i % 2) {
					myTable += " custom-stripe-row";
				}
				myTable += "'>";
				myTable += "<td class='col-lg-7 col-md-7 col-sm-7 col-xs-7 player-name'>";
				myTable += "<p id='roleName" + myRoleList[i] + "' class='player-name'>";
				myTable += masterRoleDict[myRoleList[i]] + "</p></td>";
				myTable += "<td class='col-lg-1 col-md-1 col-sm-1 col-xs-1'>";
				myTable += "<button id='selectRole" + myRoleList[i] + "' class='btn";
				if (g.legalInputList.indexOf(myRoleList[i]) == -1) {
					myTable += " disabled'>";
				} else {
					myTable += "' onClick='stepSubmit(" + myRoleList[i] + ", false)'>";
				}
				myTable += "<span class='glyphicon glyphicon-hand-left'>";
				myTable += "</span></button></td></tr>";
			}
			$("#roleListTableBody").html(myTable);
			$('#roleList').show();
			break;
		case "info":
			$('#info').show();
			break;
		case "win":
			buildPlayerTable('#winPlayerTableBody');
			$('#win').show();
			if (!DEBUG) {
				$('#winDebugButton').hide();
			}
			break;
		case "auto":
			break;
		default:
			break;
	}
	if (g.peepingTomActive != null) {
		$('.pt-section').show();
		$('.pt-button').hide();
		$('.pt-prompt').html(g.playerList[g.peepingTomActive].name + " the Peeping Tom is watching.");
		$('.pt-prompt').show();
	} else if (nextStep.hasOwnProperty("allow_PT") && g.peepingTomAvailable != null && !g.stepCompleted) {
		$('.pt-section').show();
		$('.pt-button').show();
		$('.pt-prompt').hide();
	} else {
		$('.pt-section').hide();
	}
}

function ptClick() {
	g.peepingTomTrigger = true;
	g.stepList.unshift(g.stepList[0]);
	step();
}

function confirmModal(promptText, target) {
	$('#confirmModalPrompt').html("Confirm " + promptText + "?");
	$('#confirmModalButton').attr('onClick', "stepSubmit(" + target + ", true)");
	$('#confirmModal').modal('show');
}

// 프로세스 뒤로가기
function processUndo() {
	if (g.currentPhase == "Deal" && notUndoflag == false) {
		setupGame();
	}
	else if(g.currentPhase == "Deal" && notUndoflag == true) {
		return;
	}
	if (gameStack.length < 2) {
		return;
	}
	debugPaused = true;
	gameStack.pop();
	loadGame(gameStack[gameStack.length-1]);
	return 0;
}

function saveGame() {
	var s = JSON.stringify(g);
	while (gameStack.length >= UNDO_LENGTH) {
		gameStack.shift();
	}
	gameStack.push(s);
	createCookie('witchhunt_modapp_prevgame', s, 2);
	createCookie('witchhunt_modapp_settings_adv', advancedRules, 14);
	return 0;
}

function restoreGame() {
	$('#restoreModal').modal('hide');
	loadGame(readCookie('witchhunt_modapp_prevgame'));
	return 0;
}

function loadGame(data) {
	g = JSON.parse(data);
	if (g.stepCompleted) {
		var myPrevTarget = g.prevTarget;
		gameStack.pop();
		g = JSON.parse(gameStack[gameStack.length-1]);
		stepSubmit(myPrevTarget);
	} else {
		updateView();
	}
	return 0;
}

function createCookie(name,value,days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

function eraseCookie(name) {
	createCookie(name,"",-1);
}

function debugAutoAdvanceStart() {
	if (debugPaused) { return; }

	initGame();
	step();
	clearInterval(autoSteps);
	autoSteps = setInterval(debugAutoAdvance, DEBUG_AUTO_ADVANCE_DELAY);
	$(document).keyup(function (event) {
		if (event.which == 32) {
			debugPaused = !debugPaused;
		};
	});
}

function debugAutoAdvance() {
	if (debugPaused) { return; }

	if ($(".pt-button").is(":visible")) {
		if (Math.random() < 0.05) {
			ptClick();
		}
	}
	if ($("#playerList").attr("style") == "display: block;") {
		if (g.interruptStepList.length && Math.random() > 0.75) {
			//don't select modkill
			var optionSize = g.stepList[0] == "lynch" ? g.interruptStepList.length : g.interruptStepList.length - 1;
			var input = Math.floor(Math.random() * optionSize);
			//console.log("interrupt:", input);
			interruptStep(input);
		} else {
			var legalInputList = shuffle(g.legalInputList.slice(0));
			//console.log("target:", legalInputList[0]);
			stepSubmit(legalInputList[0]);
		}
	} else if ($("#choice").attr("style") == "display: block;") {
		var legalInputList = shuffle(g.legalInputList.slice(0));
		//console.log("choice:", legalInputList[0]);
		stepSubmit(legalInputList[0]);
	} else if ($("#roleList").attr("style") == "display: block;") {
		var legalInputList = shuffle(g.legalInputList.slice(0));
		//console.log("role:", legalInputList[0]);
		stepSubmit(legalInputList[0]);
	} else if ($("#info").attr("style") == "display: block;") {
		step();
	} else if ($("#win").attr("style") == "display: block;") {
		clearInterval(autoSteps);
		setTimeout(function() { debugAutoAdvanceStart(); }, DEBUG_WIN_AUTO_ADVANCE_DELAY);
	}
}

$(document).ready(function() {
	$('.main-section').hide();
	$('#pt_section').hide();
	if (!DEBUG) {
		$('#debugButtons').hide();
	}
	if (readCookie('witchhunt_modapp_settings_adv') != null) {
		advancedRules = readCookie('witchhunt_modapp_settings_adv');
	}
	if (readCookie('witchhunt_modapp_prevgame') == null) {
		setupGame();
	} else {
		var prev = JSON.parse(readCookie('witchhunt_modapp_prevgame'));
		if (prev.version == CURRENT_VERSION) {
			$('#restoreModal').modal('show');
		} else {
			setupGame();
		}
	}
});