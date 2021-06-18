"""Add javascript column in source

Revision ID: 598ac4c0a2d7
Revises: fb42b49986cb
Create Date: 2021-06-17 13:28:16.894606

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '598ac4c0a2d7'
down_revision = 'fb42b49986cb'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('source', sa.Column('javascript', sa.Boolean(), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('source', 'javascript')
    # ### end Alembic commands ###
