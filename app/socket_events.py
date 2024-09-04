from flask import request
import sys
import json
from app.models import Party, User, Character
from flask_login import current_user
from flask_socketio import disconnect

connected_users = {}

def register_socket_events(socketio):
    @socketio.on('connect')
    def handle_connect():
        print('Client connected', file=sys.stderr)
        if current_user.is_authenticated:
            print(current_user.id, file=sys.stderr)
        else:
            print("Anonymous user connected and will be disconnected", file=sys.stderr)
            disconnect()  # Disconnect anonymous users, if desired

    @socketio.on('disconnect')
    def handle_disconnect():
        user_id = next(
            (user_id for sid, user_id in connected_users.items() if sid == request.sid), None)
        if user_id:
            del connected_users[request.sid]
            print(f'User {user_id} disconnected', file=sys.stderr)

    @socketio.on('register')
    def handle_register():
        if current_user.is_authenticated:
            connected_users[request.sid] = current_user.id
            print(f'User {current_user.id} registered with socket id {request.sid}', file=sys.stderr)
        else:
            print("Anonymous user tried to register", file=sys.stderr)

    @socketio.on('roll_dice')
    def handle_roll_dice(data):
        if not current_user.is_authenticated:
            print("Anonymous user tried to roll dice", file=sys.stderr)
            return  # Optionally disconnect or simply ignore the action

        print('Rolling dice', data, file=sys.stderr)
        print(current_user.id, file=sys.stderr)
        character_id = data.get('character_id')
        roll_result = data.get('roll')
        party_id = data.get('party_id')

        if not all([character_id, roll_result, party_id]):
            print("Missing required data", file=sys.stderr)
            return  # Missing required data

        character = Character.query.get(int(character_id))
        if not character:
            print(f"Character {character_id} not found", file=sys.stderr)
            return  # Character not found

        # Check if the current user is the owner of the character
        if str(character.owner) != str(current_user.id):
            print(f"User {current_user.id} is not the owner of character {character_id}", file=sys.stderr)
            return  # User is not the owner of the character

        party = Party.query.get(int(party_id))
        if not party:
            print(f"Party {party_id} not found", file=sys.stderr)
            return  # Party not found

        # Check if the character is actually in the party's member list
        try:
            party_members = json.loads(party.members) if party.members else []
        except json.JSONDecodeError:
            print(f"Invalid JSON in party {party_id} members list", file=sys.stderr)
            return  # Invalid JSON in party members

        if int(character_id) not in party_members:
            print(f"Character {character_id} not in party {party_id} members list. Members: {party_members}", file=sys.stderr)
            return  # Character not in this party's member list

        message = f'{character.name} rolled a {roll_result}'

        # Get the list of users who should receive this message
        try:
            subowners = json.loads(party.subowners) if party.subowners else []
        except json.JSONDecodeError:
            print(f"Invalid JSON in party {party_id} subowners list", file=sys.stderr)
            subowners = []

        recipient_user_ids = set()
        recipient_user_ids.add(str(party.owner))  # Party owner
        recipient_user_ids.update(map(str, subowners))  # Subowners
        recipient_user_ids.add(str(character.owner))  # Character owner

        # Emit the message to all connected users who should receive it
        recipients_count = 0
        for sid, user_id in connected_users.items():
            if str(user_id) in recipient_user_ids:
                socketio.emit('dice_rolled', message, room=sid)
                recipients_count += 1
                print(f"Emitted dice roll to user {user_id}", file=sys.stderr)

        print(f"Dice roll emitted to {recipients_count} recipients", file=sys.stderr)

