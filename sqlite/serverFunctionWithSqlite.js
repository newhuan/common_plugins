let db = require("./sqlite_conn");

function refreshToken( { account, ser_token, sdk_token } ) {
    account = parseInt( account, 10 );
    return new Promise( ( resolve, reject ) => {
        getToken( account ).then( data => {
            if ( !data || !data.account || data.account !== account ) {
                db.run( "INSERT INTO tokens ( account, ser_token, sdk_token ) VALUES (?,?,?)", [ account, ser_token, sdk_token ],
                    function ( err, row ) {
                        if ( !err ) {
                            resolve( row );//undefined
                        } else{
                            reject( err );
                        }
                    } );
            } else {
                if ( ser_token === data.ser_token && sdk_token === data.sdk_token ) {
                    resolve( true );
                } else {
                    db.run( "UPDATE tokens SET ser_token = ?, sdk_token = ? where account = ?;", [ ser_token, sdk_token, account ],
                        function ( err, row ) {
                            if ( !err ) {
                                resolve( row );//undefined
                            } else {
                                reject( err );
                            }
                        } );
                    }
            }
        } ).catch( e => {
            reject( e );
        } );
    } );

}

function getToken( account ) {
    return new Promise( ( resolve, reject ) => {
        db.get( "SELECT * FROM tokens WHERE account = ?;", parseInt( account, 10 ), function ( err, row ) {
            if ( !err ) {
                resolve( row );
            } else {
                console.log( err );
                reject( err );
            }
        } )
    } )
}

module.exports = {
    refreshToken, getToken
}
