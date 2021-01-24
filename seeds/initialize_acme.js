exports.seed = async function (knex) {
    const privateKey = `-----BEGIN RSA PRIVATE KEY-----
MIIEogIBAAKCAQEAmEYpYc6pV9lj9w72487w6Wi0juGn2FT/rCcOrrcdfFw4erPm
Ed7v/5DcG8UINMquICYMN9OZgeeJ+hxq4sRMxGPdGEojow4MA+jZjoh+g/sfAZYp
MfA/FL5teUi33QOD/d1HjqGdUpBGbnb2UqxM/7KiZmg/45jAfeQFmMM4lMcrBViL
6x9lGK43W+wsKPoF9abEUjUt4eAM2bdNWawiVszQJ1f7R4/HrwcjQrDIxm8s/zcQ
y9QsneQalBdvQVDkLSciLnnL6AH/YfNUodH/zwpzclv4wLvpc7zCuA1FzUHMyZwN
XJqIzyOzlBi/tOugzCCz95NOuIVGHrneShkz1wIDAQABAoIBAE9ZaGEOVxJvNvdc
Ne16PfHzXPuDvXouuNiVtcH3rAbM66WNL1uqp7euXfSelOslnt0j1oQU4M5fwHez
7ULj9fj07RamM7HZNQuogA4VNJBEAOFLxYW/Yq/Fl7h221DxbwuQDqTVtOx8QCd6
GFv2a11nUdc5heltBQnVE9GKEWb9G1tGywkwA2aSGHcMWHOvZi7uGPDYbx/FhEe1
ARelE769mf1PEU/IoYxH27iB4CE/T4eFHgZcbr0XpnJ+b4FZ+r5qi6EdwnVYVc9O
BZoS502abWaRBIeAwk1Ki7XWRRJgsf54cjU1SmbY+MqIKyF9rWxyIIEkR19z++TL
CpJLTPkCgYEA9/pa4OhRJS2wCUNHRYXdeHxvjTGUouvNDjzkb1LAaqfZk1T83X0+
3VyDIv8deJlnFdupVrhjdLoO9Ae2NMRK1A5Ff3CIgyZ0Ly3d73PO37o3tjA3nim1
2bo3rkglDphZ3Nzi9BkACeB/eLO+gBMxpvFah587Q/C0XXBrWDDnZFsCgYEAnTM6
m++4XTVZxl8SVUHV4z/HPyvUvRBSIGNwUyYn5LixR//EWYkV1BMSqsxHGGlN+net
f7M3eD51Mjnqdb8uSVP7Uxc5080Cc6bMR13wSOTXsbbiKZOO7VMZ+5WqSneCwmCF
Eg4usnHKdJXRpEy4zqdNN1juI/wIBnjeDJ8L1zUCgYA55Uy0d+kCGiGgeAG63J8x
kzPkLjA6vXz5lwPqbdKY1Cl7OXt0Jtq3ifLgB9oUnxQvSULHCXPG++2j0e0bcrzZ
t59IOrjUjfTQUxAe6NXi7DI3qhhCKBDaDZ0UZqmoN6+7XiLqxK96ntyEDMssUc7k
4DK3uVh360nhCu80/u33QwKBgCll81pbkBbj1Oeb4+0V8GjvQ96MAXNk1+v1pAAR
vVHLncxTO/dEVb5K45CdSV/RY5rBZ6yImuQMtrpqbCdkGKFw/2/LXww7Ihko5QUq
ZPwdX/xKKFdAp9QyHVaW/Iit3n6oAoNVvtB5jRKU3efB2K17e6dGwTgyyD5EGF4E
iI69AoGATYJGQIkTHCLPNPGOf+7JUL84CCF1XobJ6jteBYbiu98WRoatMerf4hux
POGk7vCQYdWkyQbX0S+ruQcKgKgrwq0jyW2QLUDVxRXzE72EPSCcbPEivIGReSA8
432kFkk2SLYiYNLeFg30xS1PPryQHG7TG+jKJd2XO5ehxl4HsLw=
-----END RSA PRIVATE KEY-----`;
    const publicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAmEYpYc6pV9lj9w72487w
6Wi0juGn2FT/rCcOrrcdfFw4erPmEd7v/5DcG8UINMquICYMN9OZgeeJ+hxq4sRM
xGPdGEojow4MA+jZjoh+g/sfAZYpMfA/FL5teUi33QOD/d1HjqGdUpBGbnb2UqxM
/7KiZmg/45jAfeQFmMM4lMcrBViL6x9lGK43W+wsKPoF9abEUjUt4eAM2bdNWawi
VszQJ1f7R4/HrwcjQrDIxm8s/zcQy9QsneQalBdvQVDkLSciLnnL6AH/YfNUodH/
zwpzclv4wLvpc7zCuA1FzUHMyZwNXJqIzyOzlBi/tOugzCCz95NOuIVGHrneShkz
1wIDAQAB
-----END PUBLIC KEY-----`;

    await knex('application_user').del();
    await knex('client_application').del();
    await knex('client').del();
    return await knex.raw(`
                DO $$
                    DECLARE clientId int;
                BEGIN
                    INSERT INTO
                        client (client_name, is_active)
                    VALUES
                        ('ACME Corp.', TRUE) RETURNING id INTO clientId;
                    
                    INSERT INTO
                        client_application(
                            client_id,
                            application_name,
                            is_active,
                            private_key,
                            public_key
                        )
                    VALUES
                        (clientId, 'Cool App', TRUE, '${privateKey}', '${publicKey}');
                END;
                $$;
            `);
};
