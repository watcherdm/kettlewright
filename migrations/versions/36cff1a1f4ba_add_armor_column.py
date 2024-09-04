"""add armor column

Revision ID: 36cff1a1f4ba
Revises: 2f7b0a53b49e
Create Date: 2024-01-20 16:32:57.057930

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '36cff1a1f4ba'
down_revision = '2f7b0a53b49e'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('characters', schema=None) as batch_op:
        batch_op.add_column(sa.Column('armor', sa.Integer(), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('characters', schema=None) as batch_op:
        batch_op.drop_column('armor')

    # ### end Alembic commands ###
