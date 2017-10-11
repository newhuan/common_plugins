//unit is ms
let minTimeForOneWord = 525,
    maxTimeForOneWord = 1000,
    otherDelayTime = 5000,
    //达到通话条数后，自动停止发送
    maxResponseNum = 50,
    minResponseNum = 10,
    minNextChatDuration = 11.5 * 60 * 60 * 1000,
    maxNextChatDuration = 48 * 60 * 60 * 1000;

function sendMsg( { nim, text, to, scene, done } ) {
    nim.sendText({
        scene,
        to,
        text,
        done: function sendMsgDone(error, msg) {
            for ( var key in msg ) {
                console.log(key, " ", msg[ key ]);
            }

        }
    })
};

function sendRequest( params ) {
    let emptyFunc = function emptyFunc( e ) {
        console.error( e, "请求失败，请稍候重试！" );
    };
    let timeoutDelay = 20000;
    $.ajax( {
        type: params.type,
        url: params.url,
        data: !!params.data ? params.data : {},
        timeout: !!params.timeout ? params.timeout : timeoutDelay,
        beforeSend: function ( request ) {
            if ( !params.headers ) {
                return
            }
            for ( var key in params.headers ) {
                request.setRequestHeader( key, params.headers[ key ] );
            }
        },
        success: typeof params.successCallback === 'function' ? params.successCallback : emptyFunc,
        error: typeof params.errorHandler === 'function' ? params.errorHandler : emptyFunc
    } );
};

function onMTConnect( nimIndex ) {
    nims[ nimIndex ].isLinking = true;
}

function onMTDisconnect( nimIndex, error ) {
    console.log(error);
    nims[ nimIndex ].isLinking = false;
    reConnect( nimIndex );
}

function reConnect( nimIndex ) {
    let i = nimIndex,
        account = accounts[ i ].account,
        token = accounts[ i ].token;
    nims[i] = new SDK.NIM({
        appKey: "c42afea2e2c9ddf57e572a5235fab8ef",
        //云信账号
        account: account,
        //云信token
        token: token,
        //连接
        onconnect: onMTConnect.bind( this, i ),
        ondisconnect: onMTDisconnect.bind( this, i ),
        onerror: onMTError.bind( this, i ),
        onwillreconnect: onWillReconnect.bind( this, i ),
        onsession: onSession.bind( this, i ),
        onMsg: onMsg.bind( this, i ),
        onmyinfo: onMyInfo.bind( this, i ),
        onfriends: onFriends.bind( this, i ),
        onsysmsg: onSysMsg.bind(this, i)
    });
    nims[ i ].userUID = account;
    robot.sendFriendRequest( i, account );
}

function onMTError( nimIndex, error ) {
    nims[ nimIndex ].isLinking = false;
    for (var key in error) {
        console.log(key + " : " + error[key] + "   ");
    }
}

function onWillReconnect( nimIndex, obj ) {
    console.log(obj.retryCount);
    console.log(obj.duration);
}

function onSession( nimIndex, obj ) {

}

function onFriends( i, friends ) {
    friendlist = nims[ i ].mergeFriends( [], friends);
    friendlist = nims[ i ].cutFriends(friendlist, friends.invalid);
    nims[ i ].users = nims[ i ].users || {};
    for ( let index = 0; index < friendlist.length; ++index ) {
        nims[ i ].users[ friendlist[ index ].account ] = {
          account: friendlist[ index ].account
        };
        robot.sayHelloToNewFriend( i, friendlist[ index ].account );
    }
}

function getUrlParam( name ) {
    let reg = new RegExp( "(^|&)" + name + "=([^&]*)(&|$)" ); //构造一个含有目标参数的正则表达式对象
    let r = window.location.search.substr( 1 ).match( reg );  //匹配目标参数
    if ( r !== null ) return unescape( r[ 2 ] ); return null; //返回参数值
}

/**
 * get a random delay time between low and high
 * @param { String } low least delay, unit is ms
 * @param { String } high lagest delay, unit is ms
 * @returns { Number } delayTime length of time delay ,unit is ms
*/
function getRandomDelay( low, high ) {
    var delayTime = parseInt( Math.random() * ( high - low ), 10 ) + low;

    return parseInt( delayTime, 10 );
}

/**
 * get response delay time
 * @param { Object } nim nim object of robot
 * @param { String } responseWords response words to send
 * @returns { String } delayTime length of time delay ,unit is ms
*/
function getResponseDelay( responseWords, nim ) {
    //每个字在0.525-1.0秒之间
    let minDelay = minTimeForOneWord,//{ Number }
        maxDelay = maxTimeForOneWord,
        duration = maxDelay - minDelay,
        delayTime = 0,
        len = responseWords.length;
    for ( let i = 0; i < len; ++i ) {
        delayTime += parseInt( Math.random() * duration, 10 );
    }
    delayTime += ( len - 1 ) * minDelay;
    //犹豫/修改/思考的时间
    delayTime += parseInt( otherDelayTime * Math.random(), 10 );
    return parseInt( delayTime, 10 );
}

function onMsg( i, msg ) {
    let who = msg.to === nims[ i ].userUID ? msg.from : msg.to,
        scene = msg.scene,
        to = msg.from;
    //非群通知消息处理
        if (/text|image|file|audio|video|geo|custom|tip/i.test(msg.type)) {
            let responseText;
            if ( msg.type !== "text" ) {
                responseText = robot.getResponseTextFromUser( msg );
                if ( responseText === "" ) {
                    return;
                }
                let text = responseText;
                robot.sendTextMsgToUser( { i, scene, to, text } );
            } else {
                robot.getResponseFromTL( i, responseText ).then( responseFromTuLin => {
                    let text = responseFromTuLin;
                    robot.sendTextMsgToUser( { i, scene, to, text } );
                });
            }
        } else {

        }
}

/**
 * get delay time between sending moment
 * @param {}
 * @returns { String } delay: times of delay
*/
function getTimeDelayBetweenSendingMoment() {
    // 1 - 24 h
    let lowLimit = 1 * 60 * 60 * 1000,
        highLimit = 24 * 60 * 60 * 1000;
    return parseInt( ( highLimit - lowLimit ) * Math.random() + lowLimit , 10 );
}

function sendTextMsgToUser( { i, scene, to, text} ) {
    let responsed = false,
        timeDelay = getResponseDelay( text );
    //todo: clearTime when get a new msg before response user
    setTimeout( function responseUser() {
        nims[ i ].sendTextMessage( {
            scene,
            to,
            isLocal: false,
            text: text,
            done: function ( error, obj ) {
                if ( error ) {
                //    send msg fail
                    if ( !responsed ) {
                        responsed = true;
                        responseUser();
                    }
                } else {
                    return;
                }
            }
        } );
    }, timeDelay );
}

function getResponseTextFromUser( msg ) {
    let responseText,
        sorryTemplete = "不好意思，我这边看不了",
        type = msg.type;
    switch ( type ) {
        case 'text':
            responseText = msg.text;
            break;
        case 'image':
            responseText = sorryTemplete + '图片';
            break;
        case 'file':
            if ( !/exe|bat/i.test( msg.file.ext ) ) {
                responseText = sorryTemplete + '文件';
            } else {
                responseText =  '你这是非法文件，我看不了啊';
            }
            break;
        case 'audio':
            responseText = '还是发文字吧，我收不了语音';
            break;
        case 'video':
            responseText = sorryTemplete + '视频';
            break;
        case 'geo':
            responseText = sorryTemplete + '位置';
            break;
        case 'tip':
            responseText = "";
            break;
        case 'custom':
            var content = JSON.parse(msg.content);
            if( !!content.ope || !!content.type && +content.type === 6 ){
                responseText = "谢谢，不过不好意思，我这边收不了红包，还是算了吧";
            }else if ( content.type === 1 ) {
                responseText = "";
            } else if ( content.type === 2 ) {
                responseText = "";
            } else if ( content.type === 3 ) {
                responseText = sorryTemplete + '表情';
            } else if ( content.type === 4 ) {
                responseText = "";
            } else if ( content.type === 7 ) {
                responseText = "";
            }else if( !!content.type && content.type === 8 ) {
                if ( content.data ) {
                    var transpondData = checkJSON( content.data );
                    if ( transpondData.type == 1 ) {
                        responseText = sorryTemplete + '图片';
                    } else if ( transpondData.type == 2 ) {
                        responseText = sorryTemplete + '视频';
                    } else if ( transpondData.type == 3 ) {
                        responseText = sorryTemplete + '文章';
                    } else {
                        responseText = "你转发的啥？我这边机器不行看不了啊。";
                    }
                } else {
                     responseText = "你转发的啥？我这边机器不行看不了啊。";
                }
            } else {
                responseText = "你发的啥？自定义消息是什么东西？我这边看不了啊。";
            }

            break;
        case 'notification':
            responseText = "";
            break;
        default:
            responseText = "";
            break;
    }
    return responseText;
}

function msgHandler( i, msg ) {
    var type = msg.attach.type,
		team = msg.attach.team;
    switch (type) {
		case 'addTeamMembers':		// 添加成员

			break;
		case 'removeTeamMembers':	// 移除成员

			break;
		case 'leaveTeam':		// 离开群

			break;
		case 'updateTeam':		// 更新群

			break;
		case 'acceptTeamInvite':	// 接受入群邀请

			break;
		case 'passTeamApply':		// 群主/管理员 通过加群邀请

			break;
		case 'dismissTeam':

			break;
		case 'updateTeamMute':

			break;
        default:				// 其他

			break;
	}
}

function onSysMsg( i, newMsg, msg ) {
    let type = msg.type;
    if (type === "deleteMsg") {
        //撤回消息

    } else if (type === "passFriendApply") {
        //通过好友申请
        let friendAccount = msg.from;
        sayHelloToNewFriend( i, friendAccount );
    } else if ( type === "deleteFriend" ){
        //好友删除通知
        let deletedUid = ( msg.from + "" ) === ( userUID + "" ) ? msg.to: msg.from;

    } else {

    }
}

function sayHelloToNewFriend( i, account ) {
    //获取一条随机的打招呼消息
    let Msgs = firstMsgs.slice( 0 ),
        len = Msgs.length,
        index = parseInt( Math.random() * len, 10 ),
        msg = Msgs[ index ];
    sendTextMsgToUser( { i, scene: "p2p", to: account, text: msg } );
}

async function getResponseFromTL( i, words ) {
    let userData = getUserData( cache.getPersonById( nims[ i ].userUID ) ),
        loc = userData.area;
    let data = await new Promise( ( resolve, reject ) => {
        $.ajax( {
            type : "get",
            data : {
                account: "mitures" + nims[ i ].userUID,
                info: words,
                loc,
                key: "e021237618384a1db1e3f0e97251c27f"
            },
            url: "http://www.tuling123.com/openapi/api",
            dataType: 'json',
            ContentType: "application/x-www-form-urlencoded; charset=UTF-8",
            success: function ( res ) {
                // console.log( res );
                resolve( res );
            },
            error: function ( e ) {
                // console.error( e );
                reject( e )
            }
        } );
    } ).catch( ( err ) => {

    } );
    let msg,
        code = data && data.code;
    if ( code && code === 100000 ){
        return data.text;
    } else {
        return "";
    }
}

/**
 * check if json string is legal
 * @param { String } msg response string from server
 * @returns { Boolean|Object } if param is illegal return false;else return object parsed by response string
 */
function checkJSON(msg) {
    if (!msg) {
        return false;
    }
    var data,
        flag = true;
    if (typeof msg === "string") {
        try {
            data = JSON.parse(msg);
        } catch (e) {
            flag = false;
        }
    } else {
        data = msg;
    }
    if (!flag) {
        return false;
    }
    return data;
}

function onMyInfo( i, data ) {
    cache.pushPersonlist( data );
}

function getUserData(data) {//account alias avatar name
    var obj = {};
    obj.account = data.account;
    if( data.custom ){
        var personMsg = JSON.parse(data.custom);
        obj.avatar = personMsg.heading ? personMsg.heading : personMsg.avatar;
        obj.name = personMsg.name;
        obj.area = personMsg.area;
        obj.sex = personMsg.sex == "1" ? "女" : "男";
    }else {
        obj.avatar = data.avatar;
        obj.name = !!data.nick ? data.nick : obj.account;
        obj.area = "中国";
        obj.sex = data.gender == "male" ? "男" : "女";
    }
    return obj;
}
var cache = ( function () {
    function Cache() {
        this.personlist = {};
        this.friendList = [];
    }
    Cache.prototype.pushPersonlist = function ( data ) {
        if ( !data.account ) {
            return;
        }
        this.personlist[ data.account ] = data;
    };

    Cache.prototype.getPersonById = function ( personId ) {
        return this.personlist[ personId ];
    };

    return new Cache();
} )();

function Robot() {
    this.init();
}
let rp = Robot.prototype;
rp.init = function () {
    //机器人接口调用上限（ 每日刷新 ）
    this.tlMaxNum = 500;
    this.root = "http://api.mitures.com:8000/";
    this.urls = {
        getAccount: "robot/",
        sendFsNewItem: "friends/new_moment"
    };
    this.initEncrypt();
    this.initNims();

};

rp.initEncrypt = function () {
    let pubKey = "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEApWlge6p6sm6LXFYZ00hd2xjo4RjbppKF+XPJqf/Z/wDGxZ08BV15prwW6w/7phcQTcpimBxP+JoLfpEjFJVnobGrDJ6C7TDaJHrBrWVKqit6ag78G8a0x/Lovl3MJziHnr4p7YNPfpJxO9gcOoKmp9Mzn2Ud9VUF2m3oq1/jOUnHKZRHs06kf1p4m2kB2EoPjiq0ge5eCRAIwA4KIvuHbO0SwXtjP6G2v8EjWVQz4fffdiNlSW4jsEP9LFEHVsCO80zw5shME0ZSteEYdtjVdPGmTdyjHFf+6o7HAjKRRABJz234Pldz3eMtzNfPZx+CtJpa+cUiQghwr/c1mdaLLQIDAQAB\n-----END PUBLIC KEY-----";
    this.encrypt = new JSEncrypt();
    this.encrypt.setPublicKey(pubKey);
};

rp.loginServer = function ( account, password ) {
    return new Promise( ( resolve, reject ) => {
        $.ajax({
//                        url: root + "user/login",
            url: this.root + "user/login",
            type: "post",
            data: {
                phone: account,
                password: this.encrypt.encrypt( password )
            },
            success: function ( res ) {
                resolve( res );
            },
            error: function ( e ) {
                reject( e );
            }
        });
    } );
}

rp.initNims = function () {
    for ( let i = startNum; i < endNum; ++i ) {
        let account = accounts[ i ].account,
            password = accounts[ i ].password;
        this.loginServer( account, password ).then( res => {
            let data = checkJSON( res );
            if ( !data ) {
                return;
            }
            let account = data.user && data.user.uid,
                sdktoken = data.user && data.user.mt_token,
                server_token = data.token;
            nims[i] = new SDK.NIM({
                appKey: "c42afea2e2c9ddf57e572a5235fab8ef",
                //云信账号
                account: account,
                //云信token
                token: sdktoken,
                //连接
                onconnect: onMTConnect.bind( this, i ),
                ondisconnect: onMTDisconnect.bind( this, i ),
                onerror: onMTError.bind( this, i ),
                onwillreconnect: onWillReconnect.bind( this, i ),
                onsession: onSession.bind( this, i ),
                onMsg: onMsg.bind( this, i ),
                onmyinfo: onMyInfo.bind( this, i ),
                onfriends: onFriends.bind( this, i ),
                onsysmsg: onSysMsg.bind( this, i )
            });
            nims[ i ].userUID = account;
            nims[ i ].server_token = server_token;
            nims[ i ].sdktoken = sdktoken;
            // this.sendFriendRequest( i, account );
            this.sendFriendSpaceMoment( nims[ i ] );
        } ).catch( function ( e ) {

        } );
    }
};

rp.sendFriendSpaceMoment = function ( nim ) {
    let that = this,
        account = nim.userUID,
        token = nim.server_token;
    this.getMomentDataFromServer().then( res => {
        var data = checkJSON( res );
        if ( !data ) {
            return;
        } else {
            this.sendMomentToServer( {
                token,
                account,
                type: data.type,
                words: data.words,
                res_json: JSON.stringify( data.srcs )
            } ).then( resp => {
                var data = checkJSON( resp );
            } ).catch( e => {
                console.log( "sendMomentToServerError:", e );
            } );
        }
    } );
    setTimeout(  () => {
        this.sendFriendSpaceMoment( nim );
    }, getTimeDelayBetweenSendingMoment() );

};

rp.sendMomentToServer = function ( param ) {
    var that = this;
    return new Promise( ( resolve, reject ) => {
        $.ajax( {
            url: that.root + this.urls.sendFsNewItem + "/" + param.account,
            data: {
                type: param.type,
                words: param.words,
                res_json: param.res_json,
                location: " ",
            },
            type: "post",
            beforeSend: function ( request ) {
                request.setRequestHeader( "token", param.token );
            },
            success: function ( res ) {
                resolve( res );
            },
            error: function ( err ) {
                reject( err );
            }
        } )
    } )
}

rp.getMomentDataFromServer = function (  ) {
    return new Promise( ( resolve, reject ) => {
        $.ajax( {
            type: "get",
            url: "/getMoment",
            data: {

            },
            beforeSend: function ( request ) {

            },
            success: function ( res ) {
                resolve( res );
            },
            error: function ( err ) {
                reject( err );
            }
        } );
    } );
}

rp.sendFriendRequest = function ( i, account ) {
    this.getAccountToRequestAsFriend( account ).then( res => {
        let data = checkJSON( res );
        if ( !data || !!data && data.msgId !== "0200" ) {
            setTimeout( this.sendFriendRequest.bind( this, i, account ), 10000 );
        } else {
            let accountToRequest = data.uid;
            this.applyFriend( i, account );
        }
    } ).catch( err => {
        console.error( err );
    } );
};

rp.applyFriend = function ( i, account ) {
    nims[ i ].applyFriend( {
        account,
        ps: '请求加为好友',
        done: ( error, obj ) => {
            if( !error ) {
                return;
            } else {
                setTimeout( this.applyFriend.bind( this, i, account ), 1000 );
            }
        }
    } );
}

rp.getAccountToRequestAsFriend = function ( account ) {
    return new Promise( ( resolve, reject ) => {
        $.ajax( {
            type: "get",
            url: this.root + this.urls.getAccount + account,
            success: function ( res ) {
                resolve( res );
            },
            error: function ( err ) {
                reject( err )
            }
        } );
    } );

};

rp.sendTextMsgToUser = function ( { i, scene, to, text} ) {
    let responsed = false,
        timeDelay = getResponseDelay( text );
    //todo: clearTime when get a new msg before response user
    setTimeout( function responseUser() {
        nims[ i ].sendText( {
            scene,
            to,
            isLocal: false,
            text: text,
            done: function ( error, obj ) {
                if ( error ) {
                //    send msg fail
                    if ( !responsed ) {
                        responsed = true;
                        responseUser();
                    }
                } else {
                    return;
                }
            }
        } );
    }, timeDelay );
};

rp.getResponseTextFromUser = function ( msg ) {
    let responseText,
        sorryTemplete = "不好意思，我这边看不了",
        type = msg.type;
    switch ( type ) {
        case 'text':
            responseText = msg.text;
            break;
        case 'image':
            responseText = sorryTemplete + '图片';
            break;
        case 'file':
            if ( !/exe|bat/i.test( msg.file.ext ) ) {
                responseText = sorryTemplete + '文件';
            } else {
                responseText =  '你这个说是一个非法文件，我看不了啊';
            }
            break;
        case 'audio':
            responseText = '还是发文字吧，我收不了语音';
            break;
        case 'video':
            responseText = sorryTemplete + '视频';
            break;
        case 'geo':
            responseText = sorryTemplete + '位置';
            break;
        case 'tip':
            responseText = "";
            break;
        case 'custom':
            var content = JSON.parse(msg.content);
            if( !!content.ope || !!content.type && +content.type === 6 ){
                responseText = "谢谢，不过不好意思，我这边收不了红包，还是算了吧";
            }else if ( content.type === 1 ) {
                responseText = "";
            } else if ( content.type === 2 ) {
                responseText = "";
            } else if ( content.type === 3 ) {
                responseText = sorryTemplete + '表情';
            } else if ( content.type === 4 ) {
                responseText = "";
            } else if ( content.type === 7 ) {
                responseText = "";
            }else if( !!content.type && content.type === 8 ) {
                if ( content.data ) {
                    var transpondData = checkJSON( content.data );
                    if ( transpondData.type == 1 ) {
                        responseText = sorryTemplete + '图片';
                    } else if ( transpondData.type == 2 ) {
                        responseText = sorryTemplete + '视频';
                    } else if ( transpondData.type == 3 ) {
                        responseText = sorryTemplete + '文章';
                    } else {
                        responseText = "你转发的啥？我这边机器不行看不了啊。";
                    }
                } else {
                     responseText = "你转发的啥？我这边机器不行看不了啊。";
                }
            } else {
                responseText = "你发的啥？自定义消息是什么东西？我这边看不了啊。";
            }

            break;
        case 'notification':
            responseText = "";
            break;
        default:
            responseText = "";
            break;
    }
    return responseText;
};

rp.msgHandler = function ( i, msg ) {
    let type = msg.attach.type,
		team = msg.attach.team;
    switch (type) {
		case 'addTeamMembers':		// 添加成员

			break;
		case 'removeTeamMembers':	// 移除成员

			break;
		case 'leaveTeam':		// 离开群

			break;
		case 'updateTeam':		// 更新群

			break;
		case 'acceptTeamInvite':	// 接受入群邀请

			break;
		case 'passTeamApply':		// 群主/管理员 通过加群邀请

			break;
		case 'dismissTeam':

			break;
		case 'updateTeamMute':

			break;
        default:				// 其他

			break;
	}
};

rp.sayHelloToNewFriend = function ( i, account ) {
    //获取一条随机的打招呼消息
    let Msgs = firstMsgs.slice( 0 ),
        len = Msgs.length,
        index = parseInt( Math.random() * len, 10 ),
        msg = Msgs[ index ];
    this.sendTextMsgToUser( { i, scene: "p2p", to: account, text: msg } );
};

rp.getResponseFromTL = async function ( i, words ) {
    let userData = getUserData( cache.getPersonById( nims[ i ].userUID ) ),
        loc = userData.area;
    let data = await new Promise( ( resolve, reject ) => {
        $.ajax( {
            type : "get",
            data : {
                account: "mitures" + nims[ i ].userUID,
                info: words,
                loc,
                key: "e021237618384a1db1e3f0e97251c27f"
            },
            url: "http://www.tuling123.com/openapi/api",
            dataType: 'json',
            ContentType: "application/x-www-form-urlencoded; charset=UTF-8",
            success: function ( res ) {
                // console.log( res );
                resolve( res );
            },
            error: function ( e ) {
                // console.error( e );
                reject( e )
            }
        } );
    } ).catch( ( err ) => {

    } );
    let msg,
        code = data && data.code;
    if ( code && code === 100000 ){
        return data.text;
    } else {
        return "";
    }
}

var seq = getUrlParam( "seq" ),
    numOfTeam = 10,
    startNum = seq * numOfTeam,
    endNum = ( parseInt( seq, 10 ) * 10 + 1 );
var len = accounts.length,
    nims = [];

let robot = new Robot();





















